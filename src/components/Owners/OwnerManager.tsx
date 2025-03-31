
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/DataTable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Owner {
  id: string;
  name: string | null;
  email: string | null;
  company_name: string | null;
  company_id: string | null;
  created_at: string;
}

const OwnerManager = () => {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
    company_name: "",
  });
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    company_name: "",
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'owner');

      if (error) throw error;
      setOwners(data || []);
    } catch (error: any) {
      console.error('Error fetching owners:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load owners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOwner = async () => {
    try {
      if (!newOwner.email || !newOwner.password || !newOwner.name || !newOwner.company_name) {
        toast({
          title: "Missing required fields",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }

      // 1. Create authentication user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newOwner.email,
        password: newOwner.password,
        options: {
          data: {
            name: newOwner.name,
          }
        }
      });

      if (authError) throw authError;

      // 2. Update the user's profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'owner',
            company_name: newOwner.company_name,
            company_id: authData.user.id // Using user id as company id for simplicity
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Owner created",
        description: `Owner ${newOwner.name} was successfully created`,
      });

      setNewOwner({
        name: "",
        email: "",
        password: "",
        company_name: "",
      });
      setIsAddDialogOpen(false);
      fetchOwners();
    } catch (error: any) {
      console.error('Error adding owner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add owner",
        variant: "destructive",
      });
    }
  };

  const handleEditOwner = async () => {
    if (!currentOwner) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editData.name || currentOwner.name,
          company_name: editData.company_name || currentOwner.company_name,
        })
        .eq('id', currentOwner.id);

      if (error) throw error;

      toast({
        title: "Owner updated",
        description: `Owner ${editData.name || currentOwner.name} was successfully updated`,
      });

      setIsEditDialogOpen(false);
      fetchOwners();
    } catch (error: any) {
      console.error('Error updating owner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update owner",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOwner = async (id: string) => {
    try {
      // Use admin functions to delete a user - this would require additional setup
      // For now, we'll just show a notification that this would require admin API
      
      toast({
        title: "Admin action required",
        description: "Deleting users requires admin API access. Please use Supabase dashboard to delete users.",
      });
      
      // In a real implementation, you would delete the user from auth.users
      // which would cascade delete their profile due to the references
    } catch (error: any) {
      console.error('Error deleting owner:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete owner",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Company", accessorKey: "company_name" },
    { 
      header: "Created At", 
      accessorKey: "created_at",
      cell: (info: any) => new Date(info.created_at).toLocaleDateString()
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (info: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setCurrentOwner(info);
              setEditData({
                name: info.name || "",
                company_name: info.company_name || "",
              });
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteOwner(info.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">System Owners</h2>
          <p className="text-sm text-gray-600">
            Manage company owners and their access
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={18} />
              Add Owner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Owner</DialogTitle>
              <DialogDescription>
                Create a new company owner account
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={newOwner.name}
                  onChange={(e) => setNewOwner({...newOwner, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={newOwner.email}
                  onChange={(e) => setNewOwner({...newOwner, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={newOwner.password}
                  onChange={(e) => setNewOwner({...newOwner, password: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company"
                  value={newOwner.company_name}
                  onChange={(e) => setNewOwner({...newOwner, company_name: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddOwner}>Add Owner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Owner</DialogTitle>
              <DialogDescription>
                Update owner's information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company">Company Name</Label>
                <Input 
                  id="edit-company"
                  value={editData.company_name}
                  onChange={(e) => setEditData({...editData, company_name: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditOwner}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Owner List</CardTitle>
          <CardDescription>
            All company owners in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable columns={columns} data={owners} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerManager;
