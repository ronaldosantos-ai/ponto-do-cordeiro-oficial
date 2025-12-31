import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AlertasNotifier } from "./components/AlertasNotifier";
import { BottomNav } from "./components/BottomNav";
import { AdminRoute } from "./components/AdminRoute";
import Index from "./pages/Index";
import Landing from "./pages/LandingV2";
import Premium from "./pages/Premium";
import PremiumInfo from "./pages/PremiumInfo";
import PremiumAtivado from "./pages/PremiumAtivado";
import Historico from "./pages/Historico";
import Graficos from "./pages/Graficos";
import Alertas from "./pages/Alertas";
import Settings from "./pages/Settings";
import GoogleSheets from "./pages/GoogleSheets";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Install from "./pages/Install";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosDeUso from "./pages/TermosDeUso";
// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSimulations from "./pages/admin/AdminSimulations";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminExports from "./pages/admin/AdminExports";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogs from "./pages/admin/AdminLogs";

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
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/premium-info" element={<PremiumInfo />} />
            <Route path="/premium/ativado" element={<PremiumAtivado />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/graficos" element={<Graficos />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/google-sheets" element={<GoogleSheets />} />
            <Route path="/install" element={<Install />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/simulations" element={<AdminRoute><AdminSimulations /></AdminRoute>} />
            <Route path="/admin/alerts" element={<AdminRoute><AdminAlerts /></AdminRoute>} />
            <Route path="/admin/exports" element={<AdminRoute><AdminExports /></AdminRoute>} />
            <Route path="/admin/billing" element={<AdminRoute><AdminBilling /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/logs" element={<AdminRoute><AdminLogs /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
