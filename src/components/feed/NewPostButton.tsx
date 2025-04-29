
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Plus } from "lucide-react";

const NewPostButton: React.FC = () => {
  return (
    <div className="mb-8 flex justify-end">
      <Button className="bg-nature-600 hover:bg-nature-700 text-white gap-2 rounded-full">
        <Plus size={18} />
        <span>New Post</span>
      </Button>
    </div>
  );
};

export default NewPostButton;
