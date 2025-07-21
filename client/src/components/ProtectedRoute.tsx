import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute - accessToken in localStorage:", !!localStorage.getItem("accessToken"));
  
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Redirecting to landing page because not authenticated");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - User is authenticated, rendering protected content");
  return <>{children}</>;
}