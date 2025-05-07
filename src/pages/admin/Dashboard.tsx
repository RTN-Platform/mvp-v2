
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, FileText, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform performance and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-nature-700" />
                Platform Overview
              </CardTitle>
              <CardDescription>Key metrics and platform status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-nature-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-nature-700">1,245</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="bg-nature-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-nature-700">128</div>
                  <div className="text-sm text-gray-600">New This Month</div>
                </div>
                <div className="bg-nature-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-nature-700">3,845</div>
                  <div className="text-sm text-gray-600">Posts Created</div>
                </div>
                <div className="bg-nature-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-nature-700">98.2%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-nature-700" />
                User Statistics
              </CardTitle>
              <CardDescription>Active and new users</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <p className="text-gray-500">User growth chart will appear here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-nature-700" />
                Content Analytics
              </CardTitle>
              <CardDescription>Most active content and engagement</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <p className="text-gray-500">Content engagement metrics will appear here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-nature-700" />
                System Health
              </CardTitle>
              <CardDescription>System performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <p className="text-gray-500">System health indicators will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
