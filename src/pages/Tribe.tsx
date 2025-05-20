
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck } from "lucide-react";
import { ConnectModal } from "@/components/tribe/ConnectModal";
import TribeHeader from "@/components/tribe/TribeHeader";
import TribeSearch from "@/components/tribe/TribeSearch";
import TribeTabContent from "@/components/tribe/TribeTabContent";
import { useTribeMembers } from "@/hooks/useTribeMembers";
import { useConnection } from "@/hooks/useConnection";

const Tribe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"connected" | "discover">("connected");
  
  const {
    connectedMembers,
    unconnectedMembers,
    isLoading,
    searchQuery,
    setSearchQuery
  } = useTribeMembers();
  
  const {
    connectingTo,
    isModalOpen,
    setIsModalOpen,
    handleConnect,
    handleSendRequest
  } = useConnection();

  // Search placeholder text based on active tab
  const searchPlaceholder = `Search ${activeTab === 'connected' ? 'connections' : 'tribe members'} by name, location or interests`;

  // Handle connect button click
  const onConnectClick = (memberId: string) => {
    handleConnect(memberId, unconnectedMembers);
  };

  return (
    <MainLayout>
      <div className="py-4">
        <TribeHeader 
          title="Your Nature Tribe" 
          description="Connect with fellow nature enthusiasts who share your interests"
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "connected" | "discover")}>
          <TabsList className="mb-6">
            <TabsTrigger value="connected" className="flex items-center gap-2">
              <UserCheck size={16} /> My Connections
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Users size={16} /> Discover Members
            </TabsTrigger>
          </TabsList>

          {/* Search bar */}
          <TribeSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            placeholder={searchPlaceholder}
          />

          <TabsContent value="connected">
            <TribeTabContent 
              isLoading={isLoading}
              members={connectedMembers}
              onConnect={onConnectClick}
              isConnected={true}
              emptyMessage="You don't have any connections yet. Discover and connect with other tribe members."
              noResultsMessage="No connections found for your search."
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="discover">
            <TribeTabContent 
              isLoading={isLoading}
              members={unconnectedMembers}
              onConnect={onConnectClick}
              isConnected={false}
              emptyMessage="No new tribe members to discover at the moment."
              noResultsMessage="No tribe members found for your search."
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
      </div>

      {connectingTo && (
        <ConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={connectingTo}
          onSendRequest={handleSendRequest}
        />
      )}
    </MainLayout>
  );
};

export default Tribe;
