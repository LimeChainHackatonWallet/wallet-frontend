import {
    startRegistration,
    RegistrationResponseJSON,
} from '@simplewebauthn/browser';


export async function registerWithPasskey(username: string) {
    const options = await fetch('/webauthn/generate-registration-options', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
  
    // WebAuthn: Start registration process
    const response: RegistrationResponseJSON = await startRegistration(options);
  
    // Store response and user data in the browser (localStorage or IndexedDB)
    localStorage.setItem('webauthn_registration', JSON.stringify(response));
  
    return response;
  }