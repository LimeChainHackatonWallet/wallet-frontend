import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import NotFoundPage from './pages/not-found'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Buy from './pages/Buy'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { MoonPayProvider } from '@moonpay/moonpay-react';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "buy",
        element: <ProtectedRoute><Buy /></ProtectedRoute>,
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
