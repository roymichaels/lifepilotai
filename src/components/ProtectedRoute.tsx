import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (import.meta.env.DEV)
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  if (import.meta.env.DEV)
    console.log("ProtectedRoute - accessToken in localStorage:", !!localStorage.getItem("accessToken"));
  
  if (!isAuthenticated) {
    if (import.meta.env.DEV)
      console.log("ProtectedRoute - Redirecting to landing page because not authenticated");
    return <Navigate to="/" replace />;
  }

  if (import.meta.env.DEV)
    console.log("ProtectedRoute - User is authenticated, rendering protected content");
  return <>{children}</>;
}
