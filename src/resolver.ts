// src/resolver.ts
import { Contract, ethers, BrowserProvider, JsonRpcProvider } from "ethers";
import fetch from "cross-fetch";
import { Resolver } from "did-resolver";
import { getResolver as getEthrResolver } from "ethr-did-resolver";
import { HyperDIDDocument } from "./types";

const HYPERDID_CONTRACT_ADDRESS = "0xB3D8E2E7e20cFc9804BdE01b698c221d3179c86D";

let didResolver: Resolver | null = null;
let globalAbi: any = null;

function normalizeDidInput(input: string): { identifier: string; tag?: string } {
  if (input.startsWith("did:")) return { identifier: input };
  const [id, tag] = input.split("#");
  return { identifier: id, tag };
}

export const initDidResolver = async (
  provider: JsonRpcProvider | BrowserProvider,
  abi: any
) => {
  globalAbi = abi;

  const config = {
    networks: [
      {
        name: "mainnet",
        rpcUrl: "https://mainnet.infura.io/v3/c08ce0a30ad2445198ca545e7698126b",
        chainId: 1,
      },
      {
        name: "sepolia",
        rpcUrl: "https://sepolia.infura.io/v3/c08ce0a30ad2445198ca545e7698126b",
        chainId: 11155111,
      },
    ],
  };

  const ethrResolver = getEthrResolver(config);
  didResolver = new Resolver(ethrResolver);

  return new HyperDIDResolver(provider, abi);
};

export const resolveDid = async (input: string) => {
  if (!didResolver) throw new Error("Resolver no inicializado");

  if (input.startsWith("did:")) {
    const result = await didResolver.resolve(input);
    return result;
  }

  if (!globalAbi) throw new Error("ABI no inicializado");

  const resolver = new HyperDIDResolver(null as any, globalAbi);
  const result = await resolver.resolve(input);
  return result;
};

export class HyperDIDResolver {
  private contract: Contract;

  constructor(provider: JsonRpcProvider | BrowserProvider | null, abi: any) {
    if (!abi) throw new Error("ABI es requerido para HyperDIDResolver");

    const usedProvider = provider
      ? provider
      : new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/c08ce0a30ad2445198ca545e7698126b");

    this.contract = new Contract(HYPERDID_CONTRACT_ADDRESS, abi, usedProvider);
  }

  async resolve(input: string): Promise<any> {
    if (!didResolver) throw new Error("Resolver no inicializado");

    const { identifier, tag } = normalizeDidInput(input);

    if (identifier.startsWith("did:")) {
      return await didResolver.resolve(identifier);
    }

    const pointer = await this.contract.resolve(identifier);
    const onChainController = await this.contract.ownerOf(identifier);

    if (!pointer) throw new Error("ID no registrado");

    const doc = await this.fetchDocument(pointer);

    const domain = {
      name: "HyperDID",
      version: "1",
      chainId: 11155111,
    };

    const types = {
      HyperDIDDoc: [
        { name: "id", type: "string" },
        { name: "controller", type: "address" },
        { name: "timestamp", type: "string" },
        { name: "counter", type: "uint256" },
      ],
    };

    const value = {
      id: doc.id,
      controller: doc.controller,
      timestamp: doc.timestamp,
      counter: doc.counter,
    };

    const signer = ethers.verifyTypedData(domain, types, value, doc.proof.jws);

    if (signer.toLowerCase() !== onChainController.toLowerCase()) {
      throw new Error("Firma inválida: no coincide con el controller on-chain");
    }

    const resolvedDid = doc.dids?.[tag || "default"];
    if (!resolvedDid) throw new Error(`No se encontró el tag '${tag || "default"}'`);

    const result = await didResolver.resolve(resolvedDid);
    if (!result?.didDocument) {
      throw new Error(`No se pudo resolver el DID derivado '${resolvedDid}'`);
    }

    return result;
  }

  private async fetchDocument(pointer: string): Promise<HyperDIDDocument> {
    let url: string;

    if (pointer.startsWith("https://")) {
      url = pointer;
    } else if (pointer.startsWith("ipfs://")) {
      const cid = pointer.slice(7);
      url = `https://ipfs.io/ipfs/${cid}`;
    } else {
      throw new Error("Tipo de puntero no soportado");
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo descargar el documento");

    const json = await res.json();
    if (!json.proof?.jws) throw new Error("Documento sin prueba válida");

    return json;
  }
}
