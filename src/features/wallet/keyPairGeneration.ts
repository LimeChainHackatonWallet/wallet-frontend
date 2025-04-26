import { Keypair } from "@solana/web3.js";

export function generateSolanaKeyPair(keypairBytes: Uint8Array) {
  // Create Keypair from secret key (Uint8Array)
  const keypair = Keypair.fromSeed(keypairBytes);
  return keypair;
}
