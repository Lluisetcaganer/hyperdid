// src/signer.ts
import { TypedDataDomain, TypedDataField, Wallet } from "ethers";
import {
  HyperDIDDocument,
  HYPERDID_EIP712_DOMAIN_NAME,
  HYPERDID_EIP712_VERSION
} from "./types";

async function validateContextURL(contextUrl: string): Promise<void> {
  const res = await fetch(contextUrl);
  if (!res.ok) throw new Error(`No se pudo obtener el contexto desde ${contextUrl}`);
  const json = await res.json();
  if (typeof json !== "object" || !json["@context"]) {
    throw new Error("El contexto obtenido no es un JSON-LD válido");
  }
}

export async function validateInputForSigning(json: any): Promise<void> {
  if (typeof json !== "object" || json === null) {
    throw new Error("El documento debe ser un objeto JSON válido");
  }

  if (json["@context"] !== "https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld") {
    throw new Error("Falta o es incorrecto el campo '@context'");
  }

  await validateContextURL(json["@context"]);

  if (typeof json.id !== "string" || json.id.trim() === "") {
    throw new Error("Falta o es inválido el campo 'id'");
  }

  if (typeof json.dids !== "object" || json.dids === null) {
    throw new Error("Falta o es inválido el campo 'dids'");
  }

  for (const [key, value] of Object.entries(json.dids)) {
    if (typeof value !== "string") {
      throw new Error(`El valor de dids['${key}'] debe ser una cadena`);
    }
  }

  if ("counter" in json && typeof json.counter !== "number") {
    throw new Error("El campo 'counter' debe ser un número si está presente");
  }
}

export const buildAndSignDocument = async (
  signer: Wallet,
  chainId: number,
  didId: string,
  dids: Record<string, string>,
  counter: number = 0
): Promise<HyperDIDDocument> => {
  const controller = await signer.getAddress();
  const timestamp = new Date().toISOString();
  const updatedCounter = counter + 1;

  const document: HyperDIDDocument = {
    "@context": "https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld",
    version: 1,
    id: didId,
    controller,
    timestamp,
    counter: updatedCounter,
    dids,
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: timestamp,
      proofPurpose: "assertionMethod",
      verificationMethod: controller,
      jws: ""
    }
  };

  const domain: TypedDataDomain = {
    name: HYPERDID_EIP712_DOMAIN_NAME,
    version: HYPERDID_EIP712_VERSION,
    chainId
  };

  const types: Record<string, TypedDataField[]> = {
    HyperDIDDoc: [
      { name: "id", type: "string" },
      { name: "controller", type: "address" },
      { name: "timestamp", type: "string" },
      { name: "counter", type: "uint256" }
    ]
  };

  const value = {
    id: document.id,
    controller: document.controller,
    timestamp: document.timestamp,
    counter: document.counter
  };

  const signature = await signer.signTypedData(domain, types, value);
  document.proof.jws = signature;

  return document;
};
