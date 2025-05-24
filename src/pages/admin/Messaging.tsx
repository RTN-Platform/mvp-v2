
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, Newspaper } from "lucide-react";
import NewsletterForm from "@/components/admin/messaging/NewsletterForm";
import PlatformMessageForm from "@/components/admin/messaging/PlatformMessageForm";
import FrontPagePostForm from "@/components/admin/messaging/FrontPagePostForm";
import MessageHistory from "@/components/admin/messaging/MessageHistory";
import AdminLayout from "@/components/layout/AdminLayout";

const Messaging = () => {
  const [activeTab, setActiveTab] = useState<"newsletters" | "platform" | "posts">("newsletters");
  const [viewMode, setViewMode] = useState<"create" | "history">("create");
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Messaging Center</CardTitle>
              <div className="flex gap-2">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "create" | "history")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="create"
                      className={viewMode === "create" ? "bg-nature-100" : ""}
                    >
                      Create New
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history"
                      className={viewMode === "history" ? "bg-nature-100" : ""}
                    >
                      Message History
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {viewMode === "create" ? (
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "newsletters" | "platform" | "posts")} className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-6">
                  <TabsTrigger value="newsletters" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Newsletters
                  </TabsTrigger>
                  <TabsTrigger value="platform" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Platform Messages
                  </TabsTrigger>
                  <TabsTrigger value="posts" className="flex items-center">
                    <Newspaper className="mr-2 h-4 w-4" />
                    Front Page Posts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="newsletters">
                  <NewsletterForm />
                </TabsContent>

                <TabsContent value="platform">
                  <PlatformMessageForm />
                </TabsContent>

                <TabsContent value="posts">
                  <FrontPagePostForm />
                </TabsContent>
              </Tabs>
            ) : (
              <MessageHistory messageType={activeTab} />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Messaging;
