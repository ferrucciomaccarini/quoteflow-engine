import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
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
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";

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
            {/* Public Routes - redirect to dashboard if authenticated */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            
            {/* Protected Routes - require authentication */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/machines" element={<ProtectedRoute><Machines /></ProtectedRoute>} />
            <Route path="/machines/:id" element={<ProtectedRoute><MachineDetails /></ProtectedRoute>} />
            <Route path="/machine-categories" element={<ProtectedRoute><MachineCategories /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/services/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
            <Route path="/service-categories" element={<ProtectedRoute><ServiceCategories /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetails /></ProtectedRoute>} />
            <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
            <Route path="/quotes/new" element={<ProtectedRoute><NewQuote /></ProtectedRoute>} />
            <Route path="/quotes/:id" element={<ProtectedRoute><QuoteDetail /></ProtectedRoute>} />
            <Route path="/risk-assessment" element={<ProtectedRoute><RiskAssessment /></ProtectedRoute>} />
            <Route path="/risk-assessment/:machineId" element={<ProtectedRoute><RiskAssessment /></ProtectedRoute>} />
            <Route path="/credit-bureau-spreads" element={<ProtectedRoute><CreditBureauSpreads /></ProtectedRoute>} />
            <Route path="/internal-rating-spreads" element={<ProtectedRoute><InternalRatingSpreads /></ProtectedRoute>} />
            <Route path="/owners" element={<ProtectedRoute><Owners /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
