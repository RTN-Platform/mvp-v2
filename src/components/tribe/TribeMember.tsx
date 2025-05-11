
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TribeMember as TribeMemberType } from "@/types/tribe";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface TribeMemberProps {
  member: TribeMemberType;
  onConnect: (id: string) => void;
  isConnected: boolean;
}

const TribeMember: React.FC<TribeMemberProps> = ({ member, onConnect, isConnected }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage
              src={member.avatar_url || ""}
              alt={member.full_name || "Tribe member"}
            />
            <AvatarFallback>
              {member.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{member.full_name}</h3>
            {member.location && (
              <p className="text-sm text-gray-500 mb-2">{member.location}</p>
            )}
            {member.interests && member.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {member.interests.slice(0, 3).map((interest, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs py-0 px-2 bg-nature-50 text-nature-700"
                  >
                    {interest}
                  </Badge>
                ))}
                {member.interests.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{member.interests.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {isConnected ? (
              <Button
                size="sm"
                variant="outline"
                className="whitespace-nowrap"
                asChild
              >
                <Link to={`/messages?contact=${member.id}`}>
                  <MessageSquare className="mr-1 h-4 w-4" /> Message
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onConnect(member.id)}
                className="whitespace-nowrap bg-nature-600 hover:bg-nature-700"
              >
                <UserPlus className="mr-1 h-4 w-4" /> Connect
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="whitespace-nowrap"
              asChild
            >
              <Link to={`/profile/${member.id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TribeMember;
