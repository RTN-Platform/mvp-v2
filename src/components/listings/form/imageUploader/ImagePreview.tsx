
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImagePreviewProps {
  url: string;
  index: number;
  isCover: boolean;
  onRemove: (index: number) => void;
  onSetCover: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  url,
  index,
  isCover,
  onRemove,
  onSetCover
}) => {
  const { toast } = useToast();

  const handleSetCover = () => {
    onSetCover(index);
    toast({
      title: "Cover Image Set",
      description: "This image will be used as the cover for your listing.",
    });
  };

  return (
    <Card className="relative overflow-hidden h-32 w-32">
      <img 
        src={url} 
        alt={`Uploaded image ${index + 1}`} 
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant={isCover ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8 bg-white text-gray-800 hover:bg-gray-100"
            onClick={handleSetCover}
          >
            <CheckCircle2 className={`h-4 w-4 ${isCover ? 'text-green-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </div>
      {isCover && (
        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
          Cover
        </div>
      )}
    </Card>
  );
};

export default ImagePreview;
