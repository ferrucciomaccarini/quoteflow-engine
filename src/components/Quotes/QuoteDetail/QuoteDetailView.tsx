
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchQuoteCalculations } from "@/utils/quoteService";
import { Json } from "@/integrations/supabase/types";
import { 
  QuoteHeader, 
  QuoteStatusBadge, 
  QuoteDetailsCard,
  LoadingState, 
  NotFoundState
} from "./components";

// Define interface for quote data
interface QuoteData {
  [key: string]: any;
  equipmentAmortization?: any[];
  servicesAmortization?: any[];
  riskAmortization?: any[];
}

const QuoteDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!user || !id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching quote details for ID:", id, "User:", user.id);
        
        // Fetch the quote details
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching quote:", error);
          throw error;
        }
        
        console.log("Quote data received:", data);
        
        if (data) {
          // Fetch the quote calculations as well
          console.log("Fetching quote calculations");
          const calculationsData = await fetchQuoteCalculations(id);
          console.log("Calculations data received:", calculationsData);
          
          // Create a deep copy of quote_data to modify it, ensuring it's an object
          const quoteData: QuoteData = 
            (data.quote_data && typeof data.quote_data === 'object')
              ? { ...(data.quote_data as Record<string, any>) } 
              : {};
          
          // Add the amortization data if calculations exist
          if (calculationsData) {
            // Check if equipment_amortization exists and is an array before assigning
            if (calculationsData.equipment_amortization && 
                Array.isArray(calculationsData.equipment_amortization)) {
              quoteData.equipmentAmortization = calculationsData.equipment_amortization as any[];
            }
            
            // Check if services_amortization exists and is an array before assigning
            if (calculationsData.services_amortization && 
                Array.isArray(calculationsData.services_amortization)) {
              quoteData.servicesAmortization = calculationsData.services_amortization as any[];
            }
            
            // Check if risk_amortization exists and is an array before assigning
            if (calculationsData.risk_amortization && 
                Array.isArray(calculationsData.risk_amortization)) {
              quoteData.riskAmortization = calculationsData.risk_amortization as any[];
            }
          }
          
          // Update the quote data
          data.quote_data = quoteData;
          
          setQuote(data);
        } else {
          setError("Quote not found");
          toast({
            title: "Quote not found",
            description: "The requested quote could not be found.",
            variant: "destructive",
          });
          navigate('/quotes');
        }
      } catch (error: any) {
        console.error('Error fetching quote details:', error);
        setError(error.message || "Failed to load quote details");
        toast({
          title: "Error",
          description: "Failed to load quote details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuote();
  }, [id, user, toast, navigate]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !quote) {
    return <NotFoundState navigate={navigate} />;
  }

  return (
    <div className="space-y-6">
      <QuoteHeader 
        quote={quote} 
        navigate={navigate}
        statusBadge={<QuoteStatusBadge status={quote.status} />} 
      />
      
      <QuoteDetailsCard 
        quote={quote} 
        navigate={navigate} 
      />
    </div>
  );
};

export default QuoteDetailView;
