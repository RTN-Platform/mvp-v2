
import React from "react";
import { Star } from "lucide-react";

type Review = {
  author: string;
  rating: number;
  comment: string;
};

type ExperienceReviewsProps = {
  reviews: Review[];
};

const ExperienceReviews: React.FC<ExperienceReviewsProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review, idx) => (
        <div key={idx} className="border-b pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{review.author}</h4>
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500" />
              <span className="ml-1">{review.rating}</span>
            </div>
          </div>
          <p className="text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ExperienceReviews;
