
import React from "react";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/comments/CommentSection";

type ExperienceDescriptionProps = {
  experienceId: string;
  description: string;
  includes: string[];
};

const ExperienceDescription: React.FC<ExperienceDescriptionProps> = ({
  experienceId,
  description,
  includes
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 mb-4">{description}</p>
      <h3 className="font-semibold text-lg mb-3">What's included:</h3>
      <ul className="space-y-2">
        {includes.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <Check size={18} className="text-nature-600 mr-2 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
      <Separator className="my-6" />
      <CommentSection experienceId={experienceId} />
    </div>
  );
};

export default ExperienceDescription;
