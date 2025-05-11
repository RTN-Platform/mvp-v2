
export interface TribeMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  location?: string | null;
  bio?: string | null;
  interests?: string[] | null;
  connected?: boolean;
}
