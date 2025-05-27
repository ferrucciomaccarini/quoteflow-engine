import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Machines from "./pages/Machines";
import Services from "./pages/Services";
import Quotes from "./pages/Quotes";
import NewQuote from "./pages/NewQuote";
import QuoteDetail from "./pages/QuoteDetail";
import RiskAssessment from "./pages/RiskAssessment";
import Customers from "./pages/Customers";
import MachineDetails from "./pages/MachineDetails";
import ServiceDetails from "./pages/ServiceDetails";
import CustomerDetails from "./pages/CustomerDetails";
import CreditBureauSpreads from "./pages/CreditBureauSpreads";
import InternalRatingSpreads from "./pages/InternalRatingSpreads";
import Owners from "./pages/Owners";
import MachineCategories from "./pages/MachineCategories";
import ServiceCategories from "./pages/ServiceCategories";
import Settings from "./pages/Settings";

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/machines/:id" element={<MachineDetails />} />
            <Route path="/machine-categories" element={<MachineCategories />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/service-categories" element={<ServiceCategories />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<NewQuote />} />
            <Route path="/quotes/:id" element={<QuoteDetail />} />
            <Route path="/risk-assessment" element={<RiskAssessment />} />
            <Route path="/risk-assessment/:machineId" element={<RiskAssessment />} />
            <Route path="/credit-bureau-spreads" element={<CreditBureauSpreads />} />
            <Route path="/internal-rating-spreads" element={<InternalRatingSpreads />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
