
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FormActionButtonsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  entityName?: string;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({ 
  isSubmitting, 
  isEditing,
  entityName = "Accommodation"
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/my-listings")}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Creating...") 
          : (isEditing ? `Update ${entityName}` : `Create ${entityName}`)
        }
      </Button>
    </div>
  );
};

export default FormActionButtons;
