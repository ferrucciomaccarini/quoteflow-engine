
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CreditBureauSpread } from "@/types/spreads";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  bureau_score: z.coerce
    .number()
    .min(1, "Score must be at least 1")
    .max(10, "Score must be at most 10"),
  spread_rate: z.coerce
    .number()
    .min(0, "Spread rate must be at least 0")
});

type FormValues = z.infer<typeof formSchema>;

export default function CreditBureauSpreadManager() {
  const [spreads, setSpreads] = useState<CreditBureauSpread[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<CreditBureauSpread | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isHistorizingSpread, setIsHistorizingSpread] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bureau_score: 5,
      spread_rate: 1.0,
    },
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bureau_score: 5,
      spread_rate: 1.0,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchSpreads();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedSpread && isEditDialogOpen) {
      editForm.setValue("bureau_score", selectedSpread.bureau_score);
      editForm.setValue("spread_rate", selectedSpread.spread_rate);
    }
  }, [selectedSpread, isEditDialogOpen, editForm]);

  const fetchSpreads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_bureau_spreads')
        .select('*')
        .order('bureau_score', { ascending: true })
        .order('valid_from', { ascending: false });

      if (error) throw error;

      setSpreads(data || []);
    } catch (error) {
      console.error("Error fetching bureau spreads:", error);
      toast({
        title: "Error",
        description: "Failed to load bureau spreads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add a spread",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('credit_bureau_spreads')
        .insert([
          {
            bureau_score: values.bureau_score,
            spread_rate: values.spread_rate,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bureau spread added successfully",
      });
      
      setIsAddDialogOpen(false);
      form.reset();
      fetchSpreads();
    } catch (error) {
      console.error("Error adding bureau spread:", error);
      toast({
        title: "Error",
        description: "Failed to add bureau spread",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (values: FormValues) => {
    if (!selectedSpread || !user?.id) return;

    try {
      // First, set valid_to on the current spread
      await supabase
        .from('credit_bureau_spreads')
        .update({ valid_to: new Date().toISOString() })
        .eq('id', selectedSpread.id);
      
      // Then insert a new spread with the updated values
      const { error } = await supabase
        .from('credit_bureau_spreads')
        .insert([
          {
            bureau_score: values.bureau_score,
            spread_rate: values.spread_rate,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bureau spread updated successfully",
      });
      
      setIsEditDialogOpen(false);
      editForm.reset();
      fetchSpreads();
    } catch (error) {
      console.error("Error updating bureau spread:", error);
      toast({
        title: "Error",
        description: "Failed to update bureau spread",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSpread) return;

    try {
      const { error } = await supabase
        .from('credit_bureau_spreads')
        .delete()
        .eq('id', selectedSpread.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bureau spread deleted successfully",
      });
      
      setIsDeleteAlertOpen(false);
      setSelectedSpread(null);
      fetchSpreads();
    } catch (error) {
      console.error("Error deleting bureau spread:", error);
      toast({
        title: "Error",
        description: "Failed to delete bureau spread",
        variant: "destructive",
      });
    }
  };

  const handleHistorize = async () => {
    if (!selectedSpread || !user?.id) return;
    
    setIsHistorizingSpread(true);
    
    try {
      // Set valid_to on the current spread to historize it
      const { error } = await supabase
        .from('credit_bureau_spreads')
        .update({ valid_to: new Date().toISOString() })
        .eq('id', selectedSpread.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bureau spread historized successfully",
      });
      
      fetchSpreads();
    } catch (error) {
      console.error("Error historizing bureau spread:", error);
      toast({
        title: "Error",
        description: "Failed to historize bureau spread",
        variant: "destructive",
      });
    } finally {
      setIsHistorizingSpread(false);
      setSelectedSpread(null);
    }
  };

  const columns: Column<CreditBureauSpread>[] = [
    {
      header: "Score",
      accessorKey: "bureau_score",
    },
    {
      header: "Spread Rate (%)",
      accessorKey: "spread_rate",
      cell: (info) => (parseFloat(info.getValue().toString()) * 100).toFixed(2) + "%",
    },
    {
      header: "Valid From",
      accessorKey: "valid_from",
      cell: (info) => format(new Date(info.getValue()), "PPP"),
    },
    {
      header: "Valid To",
      accessorKey: "valid_to",
      cell: (info) => info.getValue() ? format(new Date(info.getValue()), "PPP") : "Current",
    },
    {
      header: "Status",
      accessorKey: "valid_to",
      cell: (info) => {
        const validTo = info.getValue();
        const isCurrent = !validTo || new Date(validTo) > new Date();
        
        return isCurrent ? (
          <Badge className="bg-green-500">Current</Badge>
        ) : (
          <Badge variant="secondary">Historical</Badge>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (info) => {
        const spread = spreads.find(s => s.id === info.getValue());
        if (!spread) return null;
        
        const isCurrent = !spread.valid_to || new Date(spread.valid_to) > new Date();
        
        return (
          <div className="flex space-x-2">
            {isCurrent && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedSpread(spread);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedSpread(spread);
                    handleHistorize();
                  }}
                  disabled={isHistorizingSpread}
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    setSelectedSpread(spread);
                    setIsDeleteAlertOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Credit Bureau Spreads</h1>
          <p className="text-muted-foreground">
            Manage credit bureau score spreads (SprdBure) with historicization
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Spread
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Credit Bureau Spread</DialogTitle>
              <DialogDescription>
                Create a new spread rate for a credit bureau score
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="bureau_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bureau Score (1-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a bureau score between 1 (lowest) and 10 (highest)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spread_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spread Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the spread rate as a decimal (e.g., 0.02 for 2%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Bureau Spreads</CardTitle>
          <CardDescription>
            View and manage all credit bureau spread rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={spreads}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Credit Bureau Spread</DialogTitle>
            <DialogDescription>
              Update the spread rate for a credit bureau score
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="bureau_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bureau Score (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a bureau score between 1 (lowest) and 10 (highest)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="spread_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spread Rate</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the spread rate as a decimal (e.g., 0.02 for 2%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this bureau spread. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
