import { generateSolanaKeyPair } from "../wallet/keyPairGeneration";
import { generateRegistrationOptions } from "./webAuthn";
import { getPublicKeyAsync } from "@noble/ed25519";

// TODO: Potential problem is that when user clicks register he will register again and the old passkey will be lost (wallet will be lost)!

export default async function registerWithPasskey() {
  const publicKey = generateRegistrationOptions();

  try {
    const credentials = await navigator.credentials.create({
      publicKey: publicKey,
    });

    if (credentials) {
      const rawIdBytes = new Uint8Array(credentials.rawId);

      const hashBuffer = await crypto.subtle.digest("SHA-256", rawIdBytes);
      const seed = new Uint8Array(hashBuffer);

      // Derive public key from seed
      const publicKey = await getPublicKeyAsync(seed);

      // Concatenate seed + publicKey => 64 bytes
      const fullSecretKey = new Uint8Array(64);
      fullSecretKey.set(seed, 0);
      fullSecretKey.set(publicKey, 32);

      const wallet = await generateSolanaKeyPair(fullSecretKey);
      console.log("Registration successful, wallet:", wallet);

      return wallet.address;
    }
  } catch (err) {
    console.error("Passkey registration failed:", err);
  }
}
