import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateResidualValue, calculatePeriodicFee } from "@/utils/calculations";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CreditBureauSpread, InternalRatingSpread, StepComponentProps } from "./types";

const FinancialParametersStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const machineValue = data.machineValue || 0;
  const servicesPresentValue = data.servicesPresentValue || 0;
  const primaryRisk = machineValue + servicesPresentValue;
  const residualValuePercentage = data.residualValuePercentage || 10;
  const residualValue = calculateResidualValue(machineValue, residualValuePercentage);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoadingSpreads, setIsLoadingSpreads] = useState(false);
  const [bureauSpreads, setBureauSpreads] = useState<CreditBureauSpread[]>([]);
  const [ratingSpreads, setRatingSpreads] = useState<InternalRatingSpread[]>([]);
  
  useEffect(() => {
    const fetchSpreadRates = async () => {
      if (!user) return;
      
      setIsLoadingSpreads(true);
      try {
        const { data: bureauData, error: bureauError } = await supabase
          .from('credit_bureau_spreads')
          .select('*')
          .eq('user_id', user.id)
          .order('valid_from', { ascending: false });
          
        if (bureauError) throw bureauError;
        
        const { data: ratingData, error: ratingError } = await supabase
          .from('internal_rating_spreads')
          .select('*')
          .eq('user_id', user.id)
          .order('valid_from', { ascending: false });
          
        if (ratingError) throw ratingError;
        
        setBureauSpreads(bureauData || []);
        setRatingSpreads(ratingData || []);
      } catch (error) {
        console.error('Error fetching spread rates:', error);
        toast({
          title: "Error",
          description: "Failed to load spread rates. Using default calculations.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSpreads(false);
      }
    };
    
    fetchSpreadRates();
  }, [user, toast]);
  
  const getMostRecentBureauSpread = (score: number): number => {
    const now = new Date();
    
    const validSpreads = bureauSpreads.filter(spread => 
      spread.bureau_score === score && 
      new Date(spread.valid_from) <= now && 
      (!spread.valid_to || new Date(spread.valid_to) > now)
    );
    
    const mostRecentSpread = validSpreads.sort((a, b) => 
      new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime()
    )[0];
    
    return mostRecentSpread?.spread_rate ?? (11 - score) * 0.002;
  };
  
  const getMostRecentRatingSpread = (score: number): number => {
    const now = new Date();
    
    const validSpreads = ratingSpreads.filter(spread => 
      spread.rating_score === score && 
      new Date(spread.valid_from) <= now && 
      (!spread.valid_to || new Date(spread.valid_to) > now)
    );
    
    const mostRecentSpread = validSpreads.sort((a, b) => 
      new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime()
    )[0];
    
    return mostRecentSpread?.spread_rate ?? (11 - score) * 0.001;
  };
  
  React.useEffect(() => {
    updateData({ 
      primaryRisk,
      residualValue
    });
  }, [machineValue, servicesPresentValue, primaryRisk, residualValuePercentage, residualValue, updateData]);
  
  React.useEffect(() => {
    const contractDuration = data.contractDuration || 36;
    const baseRate = data.baseRate || 5;
    const bureauSpread = data.bureauSpread || 0.01;
    const ratingSpread = data.ratingSpread || 0.005;
    const totalRate = baseRate + (bureauSpread * 100) + (ratingSpread * 100);
    const residualValue = data.residualValue || 0;
    
    const equipmentFee = calculatePeriodicFee(
      machineValue,
      totalRate,
      contractDuration,
      residualValue
    );
    
    const servicesFee = calculatePeriodicFee(
      servicesPresentValue,
      totalRate,
      contractDuration
    );
    
    const totalFeeBeforeRisks = equipmentFee + servicesFee;
    
    updateData({
      totalRate,
      equipmentFee,
      servicesFee,
      totalFeeBeforeRisks
    });
  }, [
    data.contractDuration,
    data.baseRate,
    data.bureauSpread,
    data.ratingSpread,
    data.residualValue,
    machineValue,
    servicesPresentValue,
    updateData
  ]);

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle>Primary Risk Overview</CardTitle>
          <CardDescription>
            The sum of machinery value and services forms the primary risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Machinery Value (ImpoEqu):</span>
              <span className="font-medium">${machineValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span>Services Value (ImpoSer):</span>
              <span className="font-medium">${servicesPresentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-primary font-semibold">
              <span>Primary Risk (PrimRsk):</span>
              <span>${primaryRisk.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Credit Assessment</CardTitle>
            {isLoadingSpreads && (
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading spreads...</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="creditBureau" className="flex items-center">
                Credit Bureau Score (1-10)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select 
                value={data.creditBureau?.toString() || ""} 
                onValueChange={(value) => {
                  const score = parseInt(value);
                  const bureauSpread = getMostRecentBureauSpread(score);
                  updateData({ creditBureau: score, bureauSpread });
                }}
                disabled={isLoadingSpreads}
              >
                <SelectTrigger id="creditBureau" className={!data.creditBureau ? "border-red-300" : ""}>
                  <SelectValue placeholder="Select credit bureau score" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => {
                    const spread = getMostRecentBureauSpread(i + 1);
                    return (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} - {spread.toFixed(4)} spread
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {!data.creditBureau && (
                <p className="text-sm text-red-500">Credit Bureau score is required</p>
              )}
              {data.bureauSpread && (
                <p className="text-xs text-muted-foreground">Current spread: {data.bureauSpread.toFixed(4)}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internalRating" className="flex items-center">
                Internal Rating (1-10)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select 
                value={data.internalRating?.toString() || ""} 
                onValueChange={(value) => {
                  const score = parseInt(value);
                  const ratingSpread = getMostRecentRatingSpread(score);
                  updateData({ internalRating: score, ratingSpread });
                }}
                disabled={isLoadingSpreads}
              >
                <SelectTrigger id="internalRating" className={!data.internalRating ? "border-red-300" : ""}>
                  <SelectValue placeholder="Select internal rating" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => {
                    const spread = getMostRecentRatingSpread(i + 1);
                    return (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} - {spread.toFixed(4)} spread
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {!data.internalRating && (
                <p className="text-sm text-red-500">Internal rating is required</p>
              )}
              {data.ratingSpread && (
                <p className="text-xs text-muted-foreground">Current spread: {data.ratingSpread.toFixed(4)}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contract Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractDuration">Contract Duration (months)</Label>
              <Select
                value={data.contractDuration?.toString() || "36"}
                onValueChange={(value) => updateData({ contractDuration: parseInt(value) })}
              >
                <SelectTrigger id="contractDuration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 months (1 year)</SelectItem>
                  <SelectItem value="24">24 months (2 years)</SelectItem>
                  <SelectItem value="36">36 months (3 years)</SelectItem>
                  <SelectItem value="48">48 months (4 years)</SelectItem>
                  <SelectItem value="60">60 months (5 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseRate">Base Interest Rate (%)</Label>
              <Select
                value={data.baseRate?.toString() || "5"}
                onValueChange={(value) => updateData({ baseRate: parseFloat(value) })}
              >
                <SelectTrigger id="baseRate">
                  <SelectValue placeholder="Select base rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3.0%</SelectItem>
                  <SelectItem value="3.5">3.5%</SelectItem>
                  <SelectItem value="4">4.0%</SelectItem>
                  <SelectItem value="4.5">4.5%</SelectItem>
                  <SelectItem value="5">5.0%</SelectItem>
                  <SelectItem value="5.5">5.5%</SelectItem>
                  <SelectItem value="6">6.0%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Residual Value (%)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[residualValuePercentage]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(values) => updateData({ 
                    residualValuePercentage: values[0],
                    residualValue: calculateResidualValue(machineValue, values[0])
                  })}
                />
                <span className="w-12 text-right">{residualValuePercentage}%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Residual Value: ${residualValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Fee Calculation (Before Risks)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Base Rate (InteBase)</Label>
              <div className="text-lg font-semibold">{data.baseRate || 5}%</div>
            </div>
            <div className="space-y-1">
              <Label>Bureau Spread (SprdBure)</Label>
              <div className="text-lg font-semibold">{data.bureauSpread?.toFixed(4) || 0}</div>
            </div>
            <div className="space-y-1">
              <Label>Rating Spread (SprdRati)</Label>
              <div className="text-lg font-semibold">{data.ratingSpread?.toFixed(4) || 0}</div>
            </div>
            <div className="space-y-1">
              <Label>Total Rate (InteTot)</Label>
              <div className="text-lg font-semibold text-primary">{data.totalRate?.toFixed(2) || 0}%</div>
            </div>
          </div>
          
          <div className="h-px w-full bg-border my-2" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Equipment Fee (CanoBrkE):</span>
              <span>${data.equipmentFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Services Fee (CanoBrkS):</span>
              <span>${data.servicesFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Fee Before Risks (CanoBrkA):</span>
              <span className="text-primary">${data.totalFeeBeforeRisks?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
            </div>
            {data.residualValue > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                * Equipment fee calculated with residual value of ${data.residualValue?.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialParametersStep;
