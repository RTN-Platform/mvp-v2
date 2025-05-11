
import React from "react";

interface TribeHeaderProps {
  title: string;
  description: string;
}

const TribeHeader: React.FC<TribeHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default TribeHeader;
