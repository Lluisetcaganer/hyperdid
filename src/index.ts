// src/index.ts

import { initDidResolver, resolveDid } from "./resolver";
import { JsonRpcProvider } from "ethers";
export { buildAndSignDocument } from "./signer";
export { initDidResolver, resolveDid, HyperDIDResolver } from "./resolver";
export type { HyperDIDDocument } from "./types";

const main = async () => {
  const args = process.argv.slice(2);
  const [did] = args;
  const abi = await fetch('/abi.json').then((res) => res.json());

  if (!did) {
    console.error("Uso: npm start <did>");
    process.exit(1);
  }

  const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/c08ce0a30ad2445198ca545e7698126b");
  await initDidResolver(provider,abi);

  try {
    const result = await resolveDid(did);
    console.log("✅ DID Document:");
    console.dir(result, { depth: 4 });
  } catch (err) {
    console.error("❌ Error resolviendo DID:", err);
  }
};

main();
