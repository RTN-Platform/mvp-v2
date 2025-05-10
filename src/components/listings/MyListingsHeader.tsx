
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MyListingsHeaderProps {
  isAdminUser: boolean;
}

const MyListingsHeader: React.FC<MyListingsHeaderProps> = ({ isAdminUser }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAdminUser ? "All Listings" : "My Listings"}
        </h1>
        <p className="text-gray-600">
          {isAdminUser 
            ? "View and manage all host listings across the platform" 
            : "Manage your accommodations and experiences"}
        </p>
      </div>
      <Button 
        className="bg-nature-600 hover:bg-nature-700"
        onClick={() => navigate("/create-listing")}
      >
        <Plus className="mr-2 h-4 w-4" /> Create Listing
      </Button>
    </div>
  );
};

export default MyListingsHeader;
