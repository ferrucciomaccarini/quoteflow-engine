
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RiskData } from './types';

interface AssessmentParametersProps {
  data: RiskData;
  acquisitionValue: number;
  onChange: (changes: Partial<RiskData>) => void;
}

const AssessmentParameters: React.FC<AssessmentParametersProps> = ({ 
  data, 
  acquisitionValue, 
  onChange 
}) => {
  return (
    <div className="bg-muted p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>Acquisition Value Percentage</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[data.avPercentage]}
            min={1}
            max={100}
            step={1}
            onValueChange={(values) => onChange({ avPercentage: values[0] })}
          />
          <span className="w-10 text-right">{data.avPercentage}%</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Max Loss: ${(acquisitionValue * (data.avPercentage / 100)).toLocaleString()}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Annual Discount Rate</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[data.annualDiscountRate]}
            min={0.1}
            max={20}
            step={0.1}
            onValueChange={(values) => onChange({ annualDiscountRate: values[0] })}
          />
          <span className="w-10 text-right">{data.annualDiscountRate}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Contract Duration (Years)</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[data.contractYears]}
            min={1}
            max={10}
            step={1}
            onValueChange={(values) => onChange({ contractYears: values[0] })}
          />
          <span className="w-10 text-right">{data.contractYears}</span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentParameters;
