import React, { useState } from 'react';
import { registerWithPasskey } from '../../features/auth/Register';
import { generateSolanaKeyPair } from '../../features/wallet/keyPairGeneration';


export default function Login() {

    const handleLogin = async () => {
        // code here
    }

    return (
        <div>
            <button onClick={handleLogin}>Register</button>
        </div>
    )
}