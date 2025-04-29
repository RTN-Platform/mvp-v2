
import React from "react";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 md:px-6 max-w-4xl">
        {children}
      </main>

      {/* Nature-themed decorative elements */}
      <div className="fixed left-0 top-1/4 -z-10 hidden md:block">
        <div className="w-40 h-40 bg-nature-100 opacity-50 rounded-full blur-3xl"></div>
      </div>
      <div className="fixed right-0 bottom-1/4 -z-10 hidden md:block">
        <div className="w-60 h-60 bg-nature-200 opacity-50 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default MainLayout;
