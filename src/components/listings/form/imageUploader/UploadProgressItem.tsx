
import React from 'react';
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface UploadProgressItemProps {
  progress: number;
}

const UploadProgressItem: React.FC<UploadProgressItemProps> = ({ progress }) => {
  return (
    <Card className="relative overflow-hidden h-32 w-32">
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Spinner size="sm" className="mb-1" />
          <div className="text-xs text-gray-500">{progress}%</div>
        </div>
      </div>
    </Card>
  );
};

export default UploadProgressItem;
