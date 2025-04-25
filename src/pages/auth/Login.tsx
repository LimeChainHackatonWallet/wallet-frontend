import React, { useState } from 'react';
import loginWithPasskey from '../../features/auth/loginWithPasskey';



export default function Login() {

    const handleLogin = async () => {
        loginWithPasskey();
    }

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}