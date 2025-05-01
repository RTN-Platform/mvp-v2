
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const NewPostButton: React.FC = () => {
  return (
    <div className="mb-8 flex justify-end">
      <Button 
        asChild
        className="bg-nature-600 hover:bg-nature-700 text-white gap-2 rounded-full"
      >
        <Link to="/create-update">
          <Plus size={18} />
          <span>Add Update</span>
        </Link>
      </Button>
    </div>
  );
};

export default NewPostButton;
