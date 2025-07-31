import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadConfig } from "@/services/ConfigService";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadConfig().then(cfg => {
      if (!cfg) navigate('/setup');
      setReady(true);
    });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    if (import.meta.env.DEV)
      console.log("ProtectedRoute - Redirecting to landing page because not authenticated");
    return <Navigate to="/" replace />;
  }

  if (!ready) return null;
  return <>{children}</>;
}
