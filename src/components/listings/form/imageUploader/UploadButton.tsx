
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onClick: () => void;
  isUploading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick, isUploading }) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center justify-center"
      onClick={onClick}
      disabled={isUploading}
    >
      <Upload className="mr-2 h-4 w-4" />
      {isUploading ? 'Uploading...' : 'Upload Images'}
    </Button>
  );
};

export default UploadButton;
