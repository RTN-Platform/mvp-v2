
import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Apple } from "lucide-react";

interface SocialLoginProps {
  onGoogleClick: () => Promise<void>;
  onFacebookClick: () => Promise<void>;
  onAppleClick: () => Promise<void>;
  isLoading: boolean;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ 
  onGoogleClick, 
  onFacebookClick, 
  onAppleClick, 
  isLoading 
}) => {
  return (
    <>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onGoogleClick}
        disabled={isLoading}
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          className="h-5 w-5 mr-2" 
          alt="Google logo" 
        />
        Google
      </Button>

      <Button 
        variant="outline" 
        className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5]" 
        onClick={onFacebookClick}
        disabled={isLoading}
      >
        <Facebook className="h-5 w-5 mr-2" />
        Facebook
      </Button>

      <Button 
        variant="outline" 
        className="w-full bg-black text-white hover:bg-gray-800" 
        onClick={onAppleClick}
        disabled={isLoading}
      >
        <Apple className="h-5 w-5 mr-2" />
        Apple
      </Button>
    </>
  );
};

export default SocialLogin;
