
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { MapPin, Mail, Key, User, AlertCircle, CheckCircle } from "lucide-react";
import { Facebook, Apple } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register form schema
const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

// Reset password form schema
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

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
      // No need to manually process the token as supabase.auth.onAuthStateChange will handle it
    }
  }, [location]);

  // Form for login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form for registration
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });
  
  // Form for reset password
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
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
        registerForm.reset();
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

  const onResetPasswordSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setResetPasswordLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetPasswordSuccess(true);
      resetPasswordForm.reset();
      
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
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" placeholder="your@email.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" type="password" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-nature-600 hover:bg-nature-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    
                    <div className="text-center">
                      <button 
                        type="button" 
                        onClick={() => setResetPasswordOpen(true)} 
                        className="text-sm text-nature-600 hover:text-nature-800 hover:underline"
                      >
                        Forgotten login details?
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" placeholder="Jane Doe" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" placeholder="your@email.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" type="password" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {registrationSuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          After registering, please check your email for a confirmation link to complete your account setup.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {registrationError && (
                      <Alert className="bg-red-50 text-red-800 border-red-200 mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {registrationError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-nature-600 hover:bg-nature-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 p-6 pt-0 border-t border-nature-100 mt-4">
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
                onClick={handleGoogleSignIn}
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
                onClick={handleFacebookSignIn}
                disabled={isLoading}
              >
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </Button>

              <Button 
                variant="outline" 
                className="w-full bg-black text-white hover:bg-gray-800" 
                onClick={handleAppleSignIn}
                disabled={isLoading}
              >
                <Apple className="h-5 w-5 mr-2" />
                Apple
              </Button>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
      
      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4 py-4">
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input className="pl-10" placeholder="your@email.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {resetPasswordSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Password reset instructions have been sent to your email address.
                  </AlertDescription>
                </Alert>
              )}
              
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-nature-600 hover:bg-nature-700"
                  disabled={resetPasswordLoading}
                >
                  {resetPasswordLoading ? "Sending..." : "Send Instructions"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Auth;
