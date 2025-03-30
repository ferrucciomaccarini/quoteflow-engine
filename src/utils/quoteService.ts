
import { supabase } from "@/integrations/supabase/client";

interface QuoteData {
  customerName: string;
  contactPerson?: string;
  machineName: string;
  machineValue: number;
  timeHorizon: number;
  contractDuration: number;
  totalFee: number; // Ensuring this field is defined
  servicesPresentValue?: number;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  [key: string]: any; // For additional properties
}

export const saveQuote = async (quoteData: QuoteData) => {
  try {
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("User not authenticated");
    }
    
    const userId = sessionData.session.user.id;
    
    // Make sure totalFee is defined, if not use totalFee or totalFeeBeforeRisks or a default value
    const totalFeeToSave = quoteData.totalFee || quoteData.totalFeeBeforeRisks || 0;
    
    console.log("Saving quote with total fee:", totalFeeToSave);
    
    // Save the quote to the database
    const { data, error } = await supabase
      .from('quotes')
      .insert([
        {
          user_id: userId,
          customer_name: quoteData.customerName,
          contact_person: quoteData.contactPerson,
          machine_name: quoteData.machineName,
          machine_value: quoteData.machineValue,
          time_horizon: quoteData.timeHorizon,
          contract_duration: quoteData.contractDuration,
          total_fee: totalFeeToSave, // Use calculated value here
          services_value: quoteData.servicesPresentValue || 0,
          status: quoteData.status,
          quote_data: quoteData // Store the full quote data as JSON
        }
      ])
      .select();
    
    if (error) {
      console.error("Error saving quote:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in saveQuote:", error);
    throw error;
  }
};
