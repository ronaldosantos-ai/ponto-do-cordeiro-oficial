import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { FazendaProvider } from "./hooks/useFazenda";
import { AnimaisProvider } from "./hooks/useAnimais";
import { AdminRoute } from "./components/AdminRoute";

import AppLayout from "./components/v2/AppLayout";
import ProtectedRoute from "./components/v2/ProtectedRoute";
import LandingV5 from "./pages/LandingV5";
import ComoInstalar from "./pages/ComoInstalar";

import Dashboard from "./pages/v2/Dashboard";
import Rebanho from "./pages/v2/Rebanho";
import AnimalDetalhe from "./pages/v2/AnimalDetalhe";
import AnimalNovo from "./pages/v2/AnimalNovo";
import Pesagem from "./pages/v2/Pesagem";
import Alertas from "./pages/v2/Alertas";
import Lotes from "./pages/v2/Lotes";
import Custos from "./pages/v2/Custos";
import CustoNovo from "./pages/v2/CustoNovo";
import PesoEquilibrio from "./pages/v2/PesoEquilibrio";
import GMDRebanho from "./pages/v2/GMDRebanho";
import ComparativoMercado from "./pages/v2/ComparativoMercado";
import Relatorios from "./pages/v2/Relatorios";
import Configuracoes from "./pages/v2/Configuracoes";
import AdminDashboardV2 from "./pages/admin/AdminDashboardV2";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosDeUso from "./pages/TermosDeUso";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FazendaProvider>
        <AnimaisProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingV5 />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/como-instalar" element={<ComoInstalar />} />
                <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/termos-de-uso" element={<TermosDeUso />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboardV2 /></AdminRoute>} />

                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/rebanho" element={<Rebanho />} />
                  <Route path="/rebanho/novo" element={<AnimalNovo />} />
                  <Route path="/rebanho/:id" element={<AnimalDetalhe />} />
                  <Route path="/pesagem" element={<Pesagem />} />
                  <Route path="/alertas" element={<Alertas />} />
                  <Route path="/lotes" element={<Lotes />} />
                  <Route path="/custos" element={<Custos />} />
                  <Route path="/custos/novo" element={<CustoNovo />} />
                  <Route path="/equilibrio" element={<PesoEquilibrio />} />
                  <Route path="/gmd" element={<GMDRebanho />} />
                  <Route path="/comparativo" element={<ComparativoMercado />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AnimaisProvider>
      </FazendaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
