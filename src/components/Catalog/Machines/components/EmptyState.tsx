
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAddMachine: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddMachine }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">No machinery in your catalog yet</p>
      <Button onClick={onAddMachine}>
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Machine
      </Button>
    </div>
  );
};

export default EmptyState;
