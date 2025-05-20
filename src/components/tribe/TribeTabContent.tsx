
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TribeMember from "@/components/tribe/TribeMember";
import { TribeMember as TribeMemberType } from "@/types/tribe";

interface TribeTabContentProps {
  isLoading: boolean;
  members: TribeMemberType[];
  onConnect: (id: string) => void;
  isConnected: boolean;
  emptyMessage: string;
  noResultsMessage?: string;
  searchQuery?: string;
}

const TribeTabContent: React.FC<TribeTabContentProps> = ({
  isLoading,
  members,
  onConnect,
  isConnected,
  emptyMessage,
  noResultsMessage,
  searchQuery
}) => {
  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
                <div className="flex gap-1 mt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No members at all when not searching
  if (members.length === 0 && !searchQuery) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // No search results
  if (members.length === 0 && searchQuery && searchQuery.trim() !== '') {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">{noResultsMessage || `No ${isConnected ? 'connections' : 'members'} found for "${searchQuery}"`}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <TribeMember
          key={member.id}
          member={member}
          onConnect={onConnect}
          isConnected={isConnected}
        />
      ))}
    </div>
  );
};

export default TribeTabContent;
