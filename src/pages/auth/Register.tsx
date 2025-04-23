import React, { useState } from 'react';
import { generateSolanaKeyPair } from '../../features/wallet/keyPairGeneration';
import registerWithPasskey from '../../features/auth/UserRegistration';



export default function Register() {
    const handleRegister = async () => {
        registerWithPasskey();
    }

    return (
        <div>
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}