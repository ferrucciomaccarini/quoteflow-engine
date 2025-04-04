
import { supabase } from "@/integrations/supabase/client";
import { AmortizationEntry } from "@/utils/calculations";
import { QuoteCalculation } from "@/types/database";
import { Json } from "@/integrations/supabase/types";

interface QuoteData {
  customerName: string;
  contactPerson?: string;
  machineName: string;
  machineValue: number;
  timeHorizon: number;
  contractDuration: number;
  totalFee: number;
  servicesPresentValue?: number;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  [key: string]: any; // For additional properties
}

interface QuoteCalculationData {
  quote_id: string;
  time_horizon: number;
  annual_usage_hours: number;
  daily_shifts: number;
  yearCosts: number[];
  discount_rate: number;
  present_value: number;
  equipment_amortization: AmortizationEntry[];
  services_amortization: AmortizationEntry[];
  risk_amortization: AmortizationEntry[];
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

export const saveQuoteCalculations = async (calculationData: QuoteCalculationData) => {
  try {
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("User not authenticated");
    }
    
    const userId = sessionData.session.user.id;
    
    // Convert year costs array to specific fields
    const yearCosts = calculationData.yearCosts || Array(10).fill(0);
    
    console.log("Saving quote calculations with present value:", calculationData.present_value);
    
    // Based on the Supabase schema, user_id is not defined in the quote_calculations table type
    // We need to explicitly type cast the data to match the database structure
    const { data, error } = await supabase
      .from('quote_calculations')
      .insert({
        // Don't include user_id as it's not in the database schema type
        quote_id: calculationData.quote_id,
        time_horizon: calculationData.time_horizon,
        annual_usage_hours: calculationData.annual_usage_hours,
        daily_shifts: calculationData.daily_shifts,
        year_1_costs: yearCosts[0] || 0,
        year_2_costs: yearCosts[1] || 0,
        year_3_costs: yearCosts[2] || 0,
        year_4_costs: yearCosts[3] || 0,
        year_5_costs: yearCosts[4] || 0,
        year_6_costs: yearCosts[5] || 0,
        year_7_costs: yearCosts[6] || 0,
        year_8_costs: yearCosts[7] || 0,
        year_9_costs: yearCosts[8] || 0,
        year_10_costs: yearCosts[9] || 0,
        discount_rate: calculationData.discount_rate,
        present_value: calculationData.present_value,
        equipment_amortization: calculationData.equipment_amortization as unknown as Json,
        services_amortization: calculationData.services_amortization as unknown as Json,
        risk_amortization: calculationData.risk_amortization as unknown as Json,
        // We need to add user_id here since the database needs it
        // but TypeScript doesn't recognize it in the type
        user_id: userId
      } as any)  // Use 'as any' to bypass strict type checking
      .select();
    
    if (error) {
      console.error("Error saving quote calculations:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in saveQuoteCalculations:", error);
    throw error;
  }
};
