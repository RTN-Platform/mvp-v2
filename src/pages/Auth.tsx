
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import SocialLogin from "@/components/auth/SocialLogin";
import ResetPasswordDialog from "@/components/auth/ResetPasswordDialog";
import { useAuth } from "@/contexts/AuthContext";
import { LoginFormData, RegisterFormData, ResetPasswordFormData } from "@/schemas/authSchemas";
import { toast } from "@/components/ui/use-toast";

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { user, signIn, signUp, resetPassword, googleSignIn, facebookSignIn, appleSignIn } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle login form submission
  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;
      toast({
        title: "Login successful",
        description: "Welcome back to Resort to Nature!",
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegistrationSuccess(false);
    setRegistrationError(null);
    
    try {
      const { error, data: authData } = await signUp(data.email, data.password, {
        fullName: data.fullName
      });
      
      if (error) {
        // If this is already registered error, switch to login tab
        if (error.message?.includes('already registered')) {
          setActiveTab("login");
          setRegistrationError(error.message);
        } else {
          setRegistrationError(error.message);
        }
      } else if (authData?.session) {
        // If we have a session, registration was successful and auto-login worked
        setRegistrationSuccess(true);
        toast({
          title: "Registration successful",
          description: "Welcome to Resort to Nature!",
        });
      } else {
        // Email verification might be required
        setRegistrationSuccess(true);
        toast({
          title: "Registration successful",
          description: "Please check your email to complete registration.",
        });
      }
    } catch (error: any) {
      setRegistrationError(error.message);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(data.email);
      if (error) throw error;
      setResetSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <a href="/">
            <img
              src="/lovable-uploads/b024962f-3a9d-42e3-9da7-aaf03202e224.png"
              alt="Resort to Nature"
              className="h-16 mx-auto"
            />
          </a>
        </div>

        {/* Auth Card */}
        <Card className="border-nature-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-nature-800">
              Welcome to Resort to Nature
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to {activeTab === "login" ? "sign in" : "create an account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
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
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <SocialLogin 
              onGoogleClick={googleSignIn}
              onFacebookClick={facebookSignIn}
              onAppleClick={appleSignIn}
              isLoading={isLoading}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              By continuing, you agree to Resort to Nature's Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>

        <ResetPasswordDialog 
          open={resetPasswordOpen} 
          onOpenChange={setResetPasswordOpen} 
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          success={resetSuccess}
        />
      </div>
    </div>
  );
};

export default Auth;
