
import React from "react";
import TribeMember, { TribeMemberInterface } from "@/components/tribe/TribeMember";

interface TribeTabContentProps {
  isLoading: boolean;
  members: TribeMemberInterface[];
  onConnect: (memberId: string) => void;
  isConnected: boolean;
  emptyMessage: string;
  noResultsMessage: string;
}

const TribeTabContent: React.FC<TribeTabContentProps> = ({
  isLoading,
  members,
  onConnect,
  isConnected,
  emptyMessage,
  noResultsMessage,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <TribeMember 
              key={member.id}
              member={member}
              onConnect={onConnect}
              isConnected={isConnected}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          {noResultsMessage}
        </div>
      )}
    </>
  );
};

export default TribeTabContent;
