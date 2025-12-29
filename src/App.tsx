import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AlertasNotifier } from "./components/AlertasNotifier";
import { BottomNav } from "./components/BottomNav";
import Index from "./pages/Index";
import Premium from "./pages/Premium";
import PremiumInfo from "./pages/PremiumInfo";
import Historico from "./pages/Historico";
import Graficos from "./pages/Graficos";
import Alertas from "./pages/Alertas";
import Settings from "./pages/Settings";
import GoogleSheets from "./pages/GoogleSheets";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AlertasNotifier />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/premium-info" element={<PremiumInfo />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/graficos" element={<Graficos />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/google-sheets" element={<GoogleSheets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
