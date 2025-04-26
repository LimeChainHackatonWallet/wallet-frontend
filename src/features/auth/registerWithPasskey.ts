// auth/registerWithPasskey.js
import { Keypair } from "@solana/web3.js";
import { generateRegistrationOptions } from "./webAuthn";
import { generateSolanaKeyPair } from "../wallet/keyPairGeneration";

// Securely register a new wallet using Passkey
export default async function registerWithPasskey() {
  const publicKeyCredentialCreationOptions = generateRegistrationOptions();

  try {
    const credentials = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (!credentials) throw new Error("No credentials returned");

    const rawIdBytes = new Uint8Array(credentials.rawId);

    // Hash the rawId to create a seed
    const hashBuffer = await crypto.subtle.digest("SHA-256", rawIdBytes);
    const seed = new Uint8Array(hashBuffer); // 32 bytes

    // Generate Solana Keypair from seed
    const wallet = generateSolanaKeyPair(seed);
    // wallet.publicKey.toBase58(); -> Derive address

    return wallet;
  } catch (error) {
    console.error("Passkey registration failed:", error);
    throw error;
  }
}
