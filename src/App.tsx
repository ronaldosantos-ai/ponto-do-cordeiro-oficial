import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AdminRoute } from "./components/AdminRoute";

// V2 pages — usuário
import Dashboard from "./pages/v2/Dashboard";
import Rebanho from "./pages/v2/Rebanho";
import AnimalDetalhe from "./pages/v2/AnimalDetalhe";
import AnimalNovo from "./pages/v2/AnimalNovo";
import Pesagem from "./pages/v2/Pesagem";
import Relatorios from "./pages/v2/Relatorios";
import Configuracoes from "./pages/v2/Configuracoes";

// V2 admin
import AdminDashboardV2 from "./pages/admin/AdminDashboardV2";

// Comuns
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosDeUso from "./pages/TermosDeUso";

// V2 layout
import BottomNavV2 from "./components/v2/BottomNavV2";
import TopBarV2 from "./components/v2/TopBarV2";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TopBarV2 />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rebanho" element={<Rebanho />} />
            <Route path="/rebanho/novo" element={<AnimalNovo />} />
            <Route path="/rebanho/:id" element={<AnimalDetalhe />} />
            <Route path="/pesagem" element={<Pesagem />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardV2 /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavV2 />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
