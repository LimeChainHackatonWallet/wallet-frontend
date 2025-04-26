import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = location.pathname;
      navigate(`/register?redirect=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, location]);

  return children;
}
