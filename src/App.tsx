import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { LandingPage } from "./pages/LandingPage"
import { PricingPage } from "./components/subscription/PricingPage"
import { SubscriptionManager } from "./components/subscription/SubscriptionManager"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Onboarding } from "./pages/Onboarding"
import { SettingsPage } from "./pages/Settings"
import { ConfigSetup } from "./pages/ConfigSetup"


function App() {
  if (import.meta.env.DEV) console.log("App component is rendering");
  
  return (
  <AuthProvider>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering LandingPage for route /");
              return <LandingPage />;
            })()
          } />
          <Route path="/login" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering Login for route /login");
              return <Login />;
            })()
          } />
          <Route path="/register" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering Register for route /register");
              return <Register />;
            })()
          } />
          <Route path="/pricing" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering PricingPage for route /pricing");
              return <PricingPage />;
            })()
          } />
          <Route path="/dashboard" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering Dashboard for route /dashboard");
              return <ProtectedRoute> <Dashboard /> </ProtectedRoute>;
            })()
          } />
          <Route path="/subscription" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering SubscriptionManager for route /subscription");
              return <ProtectedRoute> <SubscriptionManager /> </ProtectedRoute>;
            })()
          } />
          <Route path="/onboarding" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering Onboarding for route /onboarding");
              return <ProtectedRoute> <Onboarding /> </ProtectedRoute>;
            })()
          } />
          <Route path="/setup" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering ConfigSetup for route /setup");
              return <ProtectedRoute> <ConfigSetup /> </ProtectedRoute>;

            })()
          } />
          <Route path="/settings" element={
            (() => {
              if (import.meta.env.DEV) console.log("Rendering SettingsPage for route /settings");
              return <ProtectedRoute> <SettingsPage /> </ProtectedRoute>;
            })()
          } />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  </AuthProvider>
  )
}

export default App
