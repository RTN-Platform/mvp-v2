
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyContactsListProps {
  searchQuery: string;
}

const EmptyContactsList: React.FC<EmptyContactsListProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 text-center text-gray-500">
      {searchQuery ? (
        <p>No contacts match your search.</p>
      ) : (
        <div>
          <p className="mb-2">No messages yet.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/tribe')}
            className="text-xs"
          >
            Connect with members
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyContactsList;
