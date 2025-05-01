
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const Messages: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-nature-800">Messages</h1>
        </div>
        
        <Card className="mb-6 border-nature-200">
          <CardHeader className="border-b border-nature-100 bg-nature-50">
            <CardTitle className="text-xl text-nature-800">Your Messages</CardTitle>
            <CardDescription>Connect with community members and hosts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-16 w-16 text-nature-200 mb-4" />
              <h3 className="text-lg font-medium text-nature-700 mb-2">No messages yet</h3>
              <p className="text-gray-500 max-w-md">
                Connect with other members or hosts to start a conversation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
