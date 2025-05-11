
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TribeSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder: string;
}

const TribeSearch: React.FC<TribeSearchProps> = ({ searchQuery, setSearchQuery, placeholder }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default TribeSearch;
