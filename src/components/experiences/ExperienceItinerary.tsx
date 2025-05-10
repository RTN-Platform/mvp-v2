
import React from "react";

type ItineraryItem = {
  time: string;
  activity: string;
};

type ExperienceItineraryProps = {
  itinerary: ItineraryItem[];
};

const ExperienceItinerary: React.FC<ExperienceItineraryProps> = ({ itinerary }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2">Your day at a glance:</h3>
      <ol className="space-y-4">
        {itinerary.map((item, idx) => (
          <li key={idx} className="flex flex-col sm:flex-row">
            <div className="font-medium text-nature-700 w-24 flex-shrink-0 mb-1 sm:mb-0">
              {item.time}
            </div>
            <div>
              <p>{item.activity}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ExperienceItinerary;
