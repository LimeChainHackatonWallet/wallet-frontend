import { generateRegistrationOptions } from "./webauthn";

export default async function registerWithPasskey() {
    const hasPasskey = !!localStorage.getItem("hasPasskey");
  
    const publicKey = generateRegistrationOptions();
  
    try {
      const credentials = hasPasskey
        ? await navigator.credentials.get({ publicKey: publicKey as any }) // fallback to any if TS still cries
        : await navigator.credentials.create({ publicKey: publicKey as any });
  
      if (credentials) {
        localStorage.setItem("hasPasskey", "true");
        console.log("Passkey created:", credentials);
      }
    } catch (err) {
      console.error("Passkey registration failed:", err);
    }
  }
  