import { createKeyPairSignerFromBytes } from "gill";

// Used documentation: https://solana.com/developers/cookbook/wallets/create-keypair

export async function generateSolanaKeyPair(keypairBytes: Uint8Array) {
  // Used Passkey to generate a solana keypair
  const signer = await createKeyPairSignerFromBytes(keypairBytes);
  return signer;
}
