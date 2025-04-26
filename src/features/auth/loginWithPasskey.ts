import { generateSolanaKeyPair } from "../wallet/keyPairGeneration";
import { generateRegistrationOptions } from "./webAuthn";

export default async function loginWithPasskey() {
  const publicKey = generateRegistrationOptions();
  const credentials = await navigator.credentials.get({
    publicKey: publicKey,
  });

  try {
    if (credentials) {
      const rawIdBytes = new Uint8Array(
        (credentials as PublicKeyCredential).rawId
      );

      const hashBuffer = await crypto.subtle.digest("SHA-256", rawIdBytes);
      const seed = new Uint8Array(hashBuffer);

      const wallet = generateSolanaKeyPair(seed);

      return wallet;
    }
  } catch (err) {
    console.error("Passkey login failed:", err);
  }
}
