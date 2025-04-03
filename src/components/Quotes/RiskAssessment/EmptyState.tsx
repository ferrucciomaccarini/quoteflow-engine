
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center">
          <p className="mb-4">No machines found. You need to add machines before you can perform risk assessments.</p>
          <Button onClick={() => navigate('/machines')}>
            Go to Machines
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
