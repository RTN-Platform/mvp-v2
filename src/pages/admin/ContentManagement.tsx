
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Home } from "lucide-react";

const ContentManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Manage and moderate platform content</p>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="listings">
            <Home className="mr-2 h-4 w-4" />
            Listings
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Other Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Accommodations & Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Review and moderate listings from hosts. Ensure they meet community guidelines and standards.
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Host</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Nature Retreat</td>
                      <td className="py-3">John Smith</td>
                      <td className="py-3">Accommodation</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Live
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Forest Yoga Experience</td>
                      <td className="py-3">Emma Wilson</td>
                      <td className="py-3">Experience</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Platform Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage user-generated content like reviews, comments, and posts. Ensure they comply with community guidelines.
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Enhanced content management features coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
