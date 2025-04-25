import { createKeyPairSignerFromBytes } from "gill";
import bip39 from "bip39";
import { derivePath} from "ed25519-hd-key";


// Used documentation: https://solana.com/developers/cookbook/wallets/create-keypair

export async function generateSolanaKeyPair(keypairBytes: Uint8Array) {

  // Used Passkey to generate a solana keypair
  const signer = await createKeyPairSignerFromBytes(keypairBytes);
  return signer;
}