// src/transact.ts
import { Contract, Wallet, BrowserProvider } from "ethers";
import abi from "../abi.json"; 

const CONTRACT_ADDRESS = "0xB3D8E2E7e20cFc9804BdE01b698c221d3179c86D"; 

export async function getRegistryContract(signerOrProvider: any): Promise<Contract> {
  return new Contract(CONTRACT_ADDRESS, abi, signerOrProvider);
}

export async function registerID(contract: Contract, id: string, pointer: string) {
  const tx = await contract.registerID(id, pointer);
  await tx.wait();
}

export async function updateID(contract: Contract, id: string, pointer: string) {
  const tx = await contract.updateID(id, pointer);
  await tx.wait();
}

export async function transferID(contract: Contract, id: string, newOwner: string) {
  const tx = await contract.transferID(id, newOwner);
  await tx.wait();
}

export async function deleteID(contract: Contract, id: string) {
  const tx = await contract.deleteID(id);
  await tx.wait();
}

export async function resolveID(contract: Contract, id: string): Promise<string> {
  return await contract.resolve(id);
}

export async function ownerOf(contract: Contract, id: string): Promise<string> {
  return await contract.ownerOf(id);
}
