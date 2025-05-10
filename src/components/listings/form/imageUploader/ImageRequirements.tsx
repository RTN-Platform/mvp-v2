
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ImageRequirements: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertDescription className="text-sm text-blue-700">
        <p><strong>Image Requirements:</strong></p>
        <ul className="list-disc pl-5 mt-1">
          <li>Accepted formats: JPG, PNG, WebP</li>
          <li>Maximum file size: 5MB per image</li>
          <li>For best results, use high-quality images with a 16:9 aspect ratio</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default ImageRequirements;
