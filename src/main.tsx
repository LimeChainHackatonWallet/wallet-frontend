import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import NotFoundPage from './pages/not-found'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import HeaderLayout from './components/layout/HeaderLayout'
import Buy from './pages/Buy'
import Send from './pages/Send'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { MoonPayProvider } from '@moonpay/moonpay-react';

// Browsers do not support WebCrypto API for ed255519 key generation
// This provides support for it
import { install } from '@solana/webcrypto-ed25519-polyfill';
install(); // patches WebCrypto for Ed25519 support

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute><HeaderLayout /></ProtectedRoute>,
          children: [
            {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "buy",
            element: <Buy />,
          },
          {
            path: "send",
            element: <Send />,
          },
        ]
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MoonPayProvider apiKey="pk_test_sFMO7I90RPndu9SRvkcEcoKSa2DPUW5" debug>
        <RouterProvider router={router} />
      </MoonPayProvider>
    </AuthProvider>
  </StrictMode>
);
