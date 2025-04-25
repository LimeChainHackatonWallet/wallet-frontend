import React, { useState } from 'react';
import registerWithPasskey from '../../features/auth/registerWithPasskey';


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