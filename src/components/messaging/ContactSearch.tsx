
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContactSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ContactSearch: React.FC<ContactSearchProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ContactSearch;
