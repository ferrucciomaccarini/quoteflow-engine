
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const QuoteDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setQuote(data);
        } else {
          toast({
            title: "Quote not found",
            description: "The requested quote could not be found.",
            variant: "destructive",
          });
          navigate('/quotes');
        }
      } catch (error: any) {
        console.error('Error fetching quote details:', error);
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3" /> Approved</div>;
      case 'Rejected':
        return <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3" /> Rejected</div>;
      default:
        return <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3" /> {status}</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span>Loading quote details...</span>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">Quote Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested quote could not be found.</p>
        <Button onClick={() => navigate('/quotes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quotes
        </Button>
      </div>
    );
  }

  const { customer_name, machine_name, total_fee, created_at, status, quote_data } = quote;
  const quoteDate = new Date(created_at).toLocaleDateString();
  const quoteDetails = quote_data || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/quotes')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotes
            </Button>
            {getStatusBadge(status)}
          </div>
          <h1 className="text-3xl font-bold mt-4">Quote Details</h1>
          <p className="text-muted-foreground">
            Quote created on {quoteDate}
          </p>
        </div>
      </div>
      
      <Card className="border-primary/20">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl">Equipment as a Service Quote</CardTitle>
          <CardDescription>
            <span className="font-medium">Customer: {customer_name}</span> · Equipment: {machine_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Customer Information</h3>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-muted-foreground">Customer:</dt>
                <dd>{customer_name}</dd>
                <dt className="text-muted-foreground">Contact Person:</dt>
                <dd>{quoteDetails.contactPerson || "N/A"}</dd>
                <dt className="text-muted-foreground">Annual Usage:</dt>
                <dd>{quoteDetails.intensityHours || 0} hours/year</dd>
                <dt className="text-muted-foreground">Daily Shifts:</dt>
                <dd>{quoteDetails.dailyShifts || 1}</dd>
                <dt className="text-muted-foreground">Setup Time:</dt>
                <dd>{quoteDetails.setupTime || 0} hours</dd>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Equipment Information</h3>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-muted-foreground">Machine:</dt>
                <dd>{machine_name}</dd>
                <dt className="text-muted-foreground">Value:</dt>
                <dd>${quoteDetails.machineValue?.toLocaleString() || "0"}</dd>
              </dl>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="financial">Financial Details</TabsTrigger>
              <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Fee</p>
                      <p className="text-2xl font-bold">${total_fee?.toLocaleString(undefined, {maximumFractionDigits: 2})}/month</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Duration</p>
                      <p className="text-xl font-medium">{quoteDetails.timeHorizon || quoteDetails.contractDuration || 36} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Total</p>
                      <p className="text-xl font-medium">
                        ${((quoteDetails.totalFee || total_fee || 0) * (quoteDetails.timeHorizon || quoteDetails.contractDuration || 36))
                            .toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Equipment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{machine_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Value: ${quoteDetails.machineValue?.toLocaleString() || "0"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {quoteDetails.selectedServices?.length ? (
                      <>
                        <p className="font-medium">{quoteDetails.selectedServices.length} service(s) selected</p>
                        <div className="mt-2 max-h-[200px] overflow-y-auto border rounded-md">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50 sticky top-0">
                              <tr className="border-b">
                                <th className="text-left p-2">Service</th>
                                <th className="text-right p-2">Parts</th>
                                <th className="text-right p-2">Labor</th>
                                <th className="text-right p-2">Consumables</th>
                                <th className="text-right p-2">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quoteDetails.selectedServices.map((service: any) => {
                                const partsCost = service.parts_cost || 0;
                                const laborCost = service.labor_cost || 0;
                                const consumablesCost = service.consumables_cost || 0;
                                const totalCost = service.totalCost || partsCost + laborCost + consumablesCost;
                                
                                return (
                                  <tr key={service.id} className="border-b">
                                    <td className="p-2">{service.name}</td>
                                    <td className="text-right p-2">${partsCost.toFixed(2)}</td>
                                    <td className="text-right p-2">${laborCost.toFixed(2)}</td>
                                    <td className="text-right p-2">${consumablesCost.toFixed(2)}</td>
                                    <td className="text-right p-2 font-medium">${totalCost.toFixed(2)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Value: ${quoteDetails.servicesPresentValue?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No services included</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Usage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Usage Intensity</p>
                      <p className="font-medium">{quoteDetails.intensityHours || 0} hours/year</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Work Shifts</p>
                      <p className="font-medium">{quoteDetails.dailyShifts || 1} shift(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Setup Time</p>
                      <p className="font-medium">{quoteDetails.setupTime || 0} hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium mb-2">Interest Rates</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">Base Rate:</dt>
                        <dd>{quoteDetails.baseRate || 5}%</dd>
                        <dt className="text-muted-foreground">Credit Bureau Spread:</dt>
                        <dd>{quoteDetails.bureauSpread?.toFixed(2) || 0}%</dd>
                        <dt className="text-muted-foreground">Internal Rating Spread:</dt>
                        <dd>{quoteDetails.ratingSpread?.toFixed(2) || 0}%</dd>
                        <dt className="text-muted-foreground font-medium">Total Interest Rate:</dt>
                        <dd className="font-medium">{quoteDetails.totalRate?.toFixed(2) || 0}%</dd>
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">Fee Structure</h3>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">Equipment Fee:</dt>
                        <dd>${quoteDetails.equipmentFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</dd>
                        <dt className="text-muted-foreground">Services Fee:</dt>
                        <dd>${quoteDetails.servicesFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</dd>
                        <dt className="text-muted-foreground">Risk Fee:</dt>
                        <dd>${quoteDetails.riskFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</dd>
                        <dt className="text-muted-foreground font-medium">Total Monthly Fee:</dt>
                        <dd className="font-medium">${total_fee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risks" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {quoteDetails.riskData?.riskVariables ? (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Risk Domain</th>
                              <th className="text-left p-2">Variable</th>
                              <th className="text-right p-2">Frequency</th>
                              <th className="text-right p-2">Max Loss</th>
                              <th className="text-right p-2">Mitigation</th>
                              <th className="text-right p-2">Residual Risk</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quoteDetails.riskData.riskVariables.map((risk: any, index: number) => (
                              <tr key={risk.id || index} className="border-b">
                                <td className="p-2">{risk.domain}</td>
                                <td className="p-2">{risk.variable}</td>
                                <td className="text-right p-2">{risk.frequency}%</td>
                                <td className="text-right p-2">${risk.maxLoss?.toLocaleString()}</td>
                                <td className="text-right p-2">{risk.mitigation}%</td>
                                <td className="text-right p-2 font-medium">${risk.residualRisk?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end p-2 bg-muted rounded-md">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Total Residual Risk:</span>
                          <p className="font-bold">${quoteDetails.totalResidualRisk?.toLocaleString() || "0"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No risk assessment data available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-muted/50 flex justify-between">
          <Button variant="outline" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          
          {status === 'Pending' && (
            <div className="flex gap-2">
              <Button variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button variant="default">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuoteDetailView;
