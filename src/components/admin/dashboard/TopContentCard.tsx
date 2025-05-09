
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type TopContentItem = {
  title: string;
  engagement: number;
  type: string;
};

type TopContentProps = {
  topContent: TopContentItem[];
};

export const TopContentCard: React.FC<TopContentProps> = ({ topContent }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-nature-700" />
          Top Content
        </CardTitle>
        <CardDescription>Most engaged listings</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {topContent.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topContent}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="title" 
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="engagement" 
                fill="#10B981" 
                name="Engagement" 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No content engagement data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
