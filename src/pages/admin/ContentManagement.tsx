
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const ContentManagement: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage and moderate platform content</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Content management features will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ContentManagement;
