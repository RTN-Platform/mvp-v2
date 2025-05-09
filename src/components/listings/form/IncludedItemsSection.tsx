
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IncludedItemsSectionProps {
  includedItems: string[];
  setIncludedItems: (items: string[]) => void;
}

const IncludedItemsSection: React.FC<IncludedItemsSectionProps> = ({
  includedItems,
  setIncludedItems,
}) => {
  const [newItem, setNewItem] = useState<string>("");

  const addIncludedItem = () => {
    if (newItem.trim() && !includedItems.includes(newItem.trim())) {
      setIncludedItems([...includedItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Add an included item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIncludedItem()}
          className="flex-1"
        />
        <Button type="button" onClick={addIncludedItem} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {includedItems.map((item, index) => (
          <div
            key={index}
            className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
          >
            {item}
            <button
              type="button"
              onClick={() => removeIncludedItem(index)}
              className="text-secondary-foreground/70 hover:text-secondary-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {includedItems.length === 0 && (
        <p className="text-sm text-gray-500">
          Add items like Equipment, Food, Drinks, Transportation, etc.
        </p>
      )}
    </div>
  );
};

export default IncludedItemsSection;
