
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AmenitiesSectionProps {
  amenities: string[];
  setAmenities: (amenities: string[]) => void;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  amenities,
  setAmenities,
}) => {
  const [newAmenity, setNewAmenity] = useState<string>("");

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Add an amenity..."
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
          className="flex-1"
        />
        <Button type="button" onClick={addAmenity} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {amenities.map((amenity, index) => (
          <div
            key={index}
            className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
          >
            {amenity}
            <button
              type="button"
              onClick={() => removeAmenity(index)}
              className="text-secondary-foreground/70 hover:text-secondary-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {amenities.length === 0 && (
        <p className="text-sm text-gray-500">
          Add amenities like WiFi, Kitchen, Free parking, etc.
        </p>
      )}
    </div>
  );
};

export default AmenitiesSection;
