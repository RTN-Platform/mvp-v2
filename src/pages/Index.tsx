
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Feed from "@/components/feed/Feed";

const Index: React.FC = () => {
  return (
    <MainLayout>
      <div className="py-4">
        <h1 className="sr-only">Resort to Nature - Feed</h1>
        <Feed />
      </div>
    </MainLayout>
  );
};

export default Index;
