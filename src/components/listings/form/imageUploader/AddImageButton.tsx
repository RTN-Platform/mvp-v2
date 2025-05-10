
import React from 'react';
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

interface AddImageButtonProps {
  onClick: () => void;
}

const AddImageButton: React.FC<AddImageButtonProps> = ({ onClick }) => {
  return (
    <Card 
      className="h-32 w-32 flex items-center justify-center cursor-pointer hover:bg-gray-50" 
      onClick={onClick}
    >
      <div className="text-center">
        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-1 text-sm text-gray-500">Add Image</p>
      </div>
    </Card>
  );
};

export default AddImageButton;
