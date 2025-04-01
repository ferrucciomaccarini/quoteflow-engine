
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface MachineCategory {
  id: string;
  name: string;
  description: string | null;
}

const MachineCategoryManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<MachineCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<MachineCategory>>({
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('machine_categories')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching machine categories:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load machine categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!user) return;
    
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('machine_categories')
        .insert({
          user_id: user.id,
          name: newCategory.name,
          description: newCategory.description || null
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      setNewCategory({ name: "", description: "" });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Machine category added successfully",
      });
    } catch (error: any) {
      console.error('Error adding machine category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add machine category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async () => {
    if (!user || !currentCategory) return;
    
    if (!currentCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('machine_categories')
        .update({
          name: currentCategory.name,
          description: currentCategory.description
        })
        .eq('id', currentCategory.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCategories(categories.map(cat => cat.id === currentCategory.id ? data : cat));
      setCurrentCategory(null);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Machine category updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating machine category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update machine category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('machine_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== id));
      
      toast({
        title: "Success",
        description: "Machine category deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting machine category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete machine category",
        variant: "destructive",
      });
    }
  };

  const categoryColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: MachineCategory) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setCurrentCategory(row);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteCategory(row.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Machine Categories</h2>
          <p className="text-muted-foreground">
            Manage categories for your machinery
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={18} />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Machine Category</DialogTitle>
              <DialogDescription>
                Create a new category for organizing your machines
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name*</Label>
                <Input 
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={newCategory.description || ""}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machine Categories</CardTitle>
          <CardDescription>
            View and manage your machine categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No machine categories found</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2" size={18} />
                Create Your First Category
              </Button>
            </div>
          ) : (
            <DataTable columns={categoryColumns} data={categories} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Machine Category</DialogTitle>
            <DialogDescription>
              Update the details of this machine category
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Category Name*</Label>
                <Input 
                  id="edit-name"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description"
                  value={currentCategory.description || ""}
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MachineCategoryManager;
