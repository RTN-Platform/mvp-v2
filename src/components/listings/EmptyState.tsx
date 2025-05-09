
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <div className="mx-auto mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">
        {description}
      </p>
      <Button 
        variant="default" 
        onClick={onAction}
      >
        <Plus className="mr-2 h-4 w-4" /> {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
