
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, FileText, BarChart } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and monitor the platform from a central location.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart className="h-6 w-6 text-nature-700" />
                Dashboard
              </CardTitle>
              <CardDescription>View platform metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button asChild variant="secondary">
                <Link to="/admin/dashboard">View Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-nature-700" />
                User Management
              </CardTitle>
              <CardDescription>View, manage, and update user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button asChild variant="secondary">
                <Link to="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-nature-700" />
                Audit Logs
              </CardTitle>
              <CardDescription>View activity logs and track system events</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button asChild variant="secondary">
                <Link to="/admin/audit-logs">View Logs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-nature-700" />
                Content Management
              </CardTitle>
              <CardDescription>Moderate and manage platform content</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button asChild variant="secondary">
                <Link to="/admin/content">Manage Content</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
