// Generate WebAuthn registration options client-side
export const generateRegistrationOptions = () => {
  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from("some-random-challenge", (c) => c.charCodeAt(0)),
    rp: {
      name: "Solana Passkey App",
      id: window.location.hostname,
    },
    user: {
      id: Uint8Array.from("solana-user-id", (c) => c.charCodeAt(0)), // Use Solana public key here (base64url string to Uint8Array if needed)
      name: "wallet-user",
      displayName: "wallet-user",
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // ES256
      },
    ],
    timeout: 60000,
    authenticatorSelection: {
      userVerification: "preferred",
      authenticatorAttachment: "platform",
    },
    attestation: "none" as AttestationConveyancePreference, // 👈 FIX: tell TS this is valid
  };

  return publicKey;
};
