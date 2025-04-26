import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AUTH_FLAG_KEY } from "@/context/AuthContext";
import loginWithPasskey from "@/features/auth/loginWithPasskey";
import { LoadingState } from "./LoadingState";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const storedAuthFlag = localStorage.getItem(AUTH_FLAG_KEY);

  function handleNavigateToRegister() {
    const currentPath = location.pathname;
    navigate(`/register?redirect=${encodeURIComponent(currentPath)}`, {
      replace: true,
    });
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        if (storedAuthFlag === "true") {
          try {
            const wallet = await loginWithPasskey();
            if (!wallet) {
              return;
            }
            login({
              address: wallet.publicKey.toBase58(),
              keyPairSigner: wallet,
            });
          } catch (error) {
            console.error("Login error:", error);
            if ((error as Error).message.includes("not allowed")) {
              handleNavigateToRegister();
            }
          }
        } else {
          handleNavigateToRegister();
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, navigate, location, storedAuthFlag]);

  if (storedAuthFlag === "true" && !isAuthenticated) {
    return <LoadingState />;
  }

  return children;
}
