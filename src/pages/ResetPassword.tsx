
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Key, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MainLayout from "@/components/layout/MainLayout";

// Password reset form schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [hashFragment, setHashFragment] = useState<string | null>(null);

  // Form for resetting password
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Extract the hash fragment from the URL
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      setHashFragment(hash);
    } else {
      // If there's no hash fragment, the user might have navigated here directly
      // Show a message indicating they need to use a valid reset link
      setResetError("Invalid or expired password reset link. Please request a new password reset link.");
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!hashFragment) {
      setResetError("Invalid or expired password reset link. Please request a new password reset link.");
      return;
    }
    
    setIsLoading(true);
    setResetError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) throw error;
      
      setResetSuccess(true);
      form.reset();
      
      // After 3 seconds, redirect to the login page
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      
    } catch (error: any) {
      setResetError(error.message || "Failed to reset password. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-8">
        <Card className="border-nature-200 shadow-sm">
          <CardHeader className="text-center border-b border-nature-100 bg-nature-50 rounded-t-lg">
            <CardTitle className="text-2xl text-nature-800 font-serif">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {resetError ? (
              <Alert className="bg-red-50 text-red-800 border-red-200 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resetError}</AlertDescription>
              </Alert>
            ) : resetSuccess ? (
              <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
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
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-nature-600 hover:bg-nature-700"
                      disabled={isLoading || !hashFragment}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
