// src/types.ts
export interface HyperDIDProof {
  type: "EcdsaSecp256k1Signature2019";
  created: string; // ISO date-time
  proofPurpose: "assertionMethod";
  verificationMethod: string; // Ethereum address
  jws: string;
}

export interface HyperDIDDocument {
  "@context": "https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld";
  version: 1;
  id: string;
  controller: string;
  timestamp: string; // ISO date-time
  counter: number;
  proof: HyperDIDProof;
  dids: {
    [tag: string]: string;
  };
}



export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export const HYPERDID_EIP712_DOMAIN_NAME = "HyperDID";
export const HYPERDID_EIP712_VERSION = "1";

export interface ResolverConfig {
  contractAddress: string;
  abi: any;
  runner: import("ethers").ContractRunner;
  ipfsGateway?: string;
}
