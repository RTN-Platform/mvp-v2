
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import components
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ResetPasswordDialog from "@/components/auth/ResetPasswordDialog";
import SocialLogin from "@/components/auth/SocialLogin";

// Import types
import { LoginFormData, RegisterFormData, ResetPasswordFormData } from "@/schemas/authSchemas";

const Auth: React.FC = () => {
  const { user, signIn, signUp, googleSignIn, facebookSignIn, appleSignIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const location = useLocation();
  const { toast } = useToast();
  
  // State for registration success message
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  
  // State for reset password dialog
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  // Handle auth redirects with URL hash fragments
  useEffect(() => {
    // Check if there's a hash fragment in the URL (from Supabase auth redirect)
    if (location.hash && (location.hash.includes("access_token") || location.hash.includes("error"))) {
      console.log("Auth redirect detected with hash fragment");
      // The Supabase client will automatically handle this
    }
  }, [location]);

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);
    
    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingUsers) {
        setRegistrationError("This email address is already registered. Please log in or use the password reset option if you've forgotten your login details.");
        return;
      }
      
      const result = await signUp(data.email, data.password, {
        full_name: data.fullName,
      });
      
      if (!result.error) {
        setRegistrationSuccess(true);
      }
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        setRegistrationError("This email address is already registered. Please log in or use the password reset option if you've forgotten your login details.");
      } else {
        setRegistrationError(error.message || "An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    setResetPasswordLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetPasswordSuccess(true);
      
      setTimeout(() => {
        setResetPasswordOpen(false);
        setResetPasswordSuccess(false);
      }, 5000);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send password reset instructions. Please try again.",
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await googleSignIn();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      await facebookSignIn();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      await appleSignIn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-8">
        <Card className="border-nature-200 shadow-sm">
          <CardHeader className="text-center border-b border-nature-100 bg-nature-50 rounded-t-lg">
            <CardTitle className="text-2xl text-nature-800 font-serif">Welcome to Nature</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="login">
                <LoginForm 
                  onSubmit={handleLoginSubmit}
                  isLoading={isLoading}
                  onResetPasswordClick={() => setResetPasswordOpen(true)}
                />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm
                  onSubmit={handleRegisterSubmit}
                  isLoading={isLoading}
                  registrationSuccess={registrationSuccess}
                  registrationError={registrationError}
                />
              </TabsContent>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 p-6 pt-0 border-t border-nature-100 mt-4">
              <SocialLogin
                onGoogleClick={handleGoogleSignIn}
                onFacebookClick={handleFacebookSignIn}
                onAppleClick={handleAppleSignIn}
                isLoading={isLoading}
              />
            </CardFooter>
          </Tabs>
        </Card>
      </div>
      
      {/* Reset Password Dialog */}
      <ResetPasswordDialog 
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        onSubmit={handleResetPasswordSubmit}
        isLoading={resetPasswordLoading}
        success={resetPasswordSuccess}
      />
    </MainLayout>
  );
};

export default Auth;
