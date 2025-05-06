
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/utils/roles';

type Profile = {
  id: string;
  avatar_url: string | null;
  full_name: string | null;
  username: string | null;
  website: string | null; 
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  role: UserRole;
  updated_at: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
  appleSignIn: () => Promise<void>;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
  updateUserRole?: (userId: string, role: UserRole) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Fetch user profile after login - Use setTimeout to avoid Supabase lock
          setTimeout(() => fetchUserProfile(currentSession.user.id), 0);
        }
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      // Sign up user with Supabase - disabled redirect during testing
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth`,
          // During testing, we auto-confirm emails
        },
      });

      if (error) {
        // Check for duplicate email error
        if (error.message?.includes('already registered')) {
          return { 
            data: null, 
            error: { 
              message: 'This email is already registered. Please log in instead.' 
            } 
          };
        }
        throw error;
      }
      
      // With email verification disabled in Supabase dashboard, we should have a session immediately
      if (data.session) {
        toast({
          title: "Registration successful",
          description: "Welcome to Resort to Nature!",
        });
        return { data, error: null };
      } else {
        // If for some reason we don't have a session, prompt to check email
        return { 
          data, 
          error: { 
            message: 'Registration successful! Please check your email to verify your account.'
          }
        };
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
      });
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Modified to allow sign in even if email isn't confirmed
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle "Email not confirmed" error specially
        if (error.message?.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Email not confirmed. Please check your email for a verification link or contact support.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message || "Invalid login credentials. Please try again.",
          });
        }
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid login credentials. Please try again.",
      });
      return { data: null, error };
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the reset link.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || "Failed to send reset email. Please try again.",
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/auth',
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in failed`,
        description: error.message || `Could not sign in with ${provider}. Please try again.`,
      });
    }
  };

  const googleSignIn = () => handleOAuthSignIn('google');
  const facebookSignIn = () => handleOAuthSignIn('facebook');
  const appleSignIn = () => handleOAuthSignIn('apple');

  // New role-based function to check permissions
  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user || !profile) return false;
    
    // Convert to array for easier checking
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Admin has access to everything
    if (profile.role === 'admin') return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.includes(profile.role);
  };

  // Admin-only function to update user roles
  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    if (!profile || profile.role !== 'admin') {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can update user roles.",
      });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('update_user_role', {
        user_id: userId,
        new_role: role
      });

      if (error) throw error;

      toast({
        title: "Role updated",
        description: `User role successfully updated to ${role}.`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update role",
        description: error.message || "An error occurred while updating the user role.",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signUp,
        signIn,
        resetPassword,
        signOut,
        googleSignIn,
        facebookSignIn,
        appleSignIn,
        hasRole,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
