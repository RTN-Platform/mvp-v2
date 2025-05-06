
import { User } from "@supabase/supabase-js";

export type UserRole = 'visitor' | 'tribe' | 'host' | 'admin';

export const isAdmin = (profile: any | null): boolean => {
  return profile?.role === 'admin';
};

export const isHost = (profile: any | null): boolean => {
  return profile?.role === 'host' || profile?.role === 'admin';
};

export const isTribeMember = (profile: any | null): boolean => {
  return !!profile?.role && profile.role !== 'visitor';
};

export const canCreateListing = (profile: any | null): boolean => {
  return isHost(profile);
};

export const canEditContent = (profile: any | null, ownerId: string | null | undefined): boolean => {
  if (!profile || !ownerId) return false;
  return profile.id === ownerId || isAdmin(profile);
};

export const getAccessLevel = (profile: any | null): number => {
  if (!profile) return 0; // Visitor
  switch (profile.role) {
    case 'admin': return 3;
    case 'host': return 2;
    case 'tribe': return 1;
    default: return 0;
  }
};
