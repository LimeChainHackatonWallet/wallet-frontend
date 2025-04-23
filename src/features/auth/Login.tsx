// src/features/auth/webAuthn.ts
import {
    startAuthentication,
    AuthenticationResponseJSON,
  } from '@simplewebauthn/browser';
  
  export async function loginWithPasskey() {
    const options = await fetch('/webauthn/generate-authentication-options', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
  
    // WebAuthn: Start authentication process
    const response: AuthenticationResponseJSON = await startAuthentication(options);
  
    // Store response in the browser (localStorage or IndexedDB)
    localStorage.setItem('webauthn_authentication', JSON.stringify(response));
  
    return response;
  }
  