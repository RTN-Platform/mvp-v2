export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accommodations: {
        Row: {
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          cover_image: string | null
          created_at: string
          description: string
          host_id: string
          house_rules: string | null
          id: string
          images: string[] | null
          is_published: boolean | null
          location: string
          max_guests: number
          price_per_night: number
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          bathrooms: number
          bedrooms: number
          cover_image?: string | null
          created_at?: string
          description: string
          host_id: string
          house_rules?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          location: string
          max_guests: number
          price_per_night: number
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          cover_image?: string | null
          created_at?: string
          description?: string
          host_id?: string
          house_rules?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          location?: string
          max_guests?: number
          price_per_night?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          invitee_id: string
          inviter_id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          capacity: number
          cover_image: string | null
          created_at: string
          description: string
          duration: number
          host_id: string
          id: string
          images: string[] | null
          included_items: string[] | null
          is_published: boolean | null
          location: string
          price_per_person: number
          requirements: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity: number
          cover_image?: string | null
          created_at?: string
          description: string
          duration: number
          host_id: string
          id?: string
          images?: string[] | null
          included_items?: string[] | null
          is_published?: boolean | null
          location: string
          price_per_person: number
          requirements?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          cover_image?: string | null
          created_at?: string
          description?: string
          duration?: number
          host_id?: string
          id?: string
          images?: string[] | null
          included_items?: string[] | null
          is_published?: boolean | null
          location?: string
          price_per_person?: number
          requirements?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      host_applications: {
        Row: {
          admin_notes: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
          venue_description: string
          venue_location: string
          venue_name: string
          venue_type: string
          verification_documents: string[] | null
        }
        Insert: {
          admin_notes?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          venue_description: string
          venue_location: string
          venue_name: string
          venue_type: string
          verification_documents?: string[] | null
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          venue_description?: string
          venue_location?: string
          venue_name?: string
          venue_type?: string
          verification_documents?: string[] | null
        }
        Relationships: []
      }
      listing_audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          is_system: boolean
          recipient_id: string
          related_entity_id: string | null
          related_entity_type: string | null
          sender_id: string | null
          subject: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_system?: boolean
          recipient_id: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          sender_id?: string | null
          subject: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_system?: boolean
          recipient_id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          sender_id?: string | null
          subject?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          interests: string[] | null
          location: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      content_analytics_view: {
        Row: {
          content_type: string | null
          event_count: number | null
          event_day: string | null
          event_type: string | null
          unique_users: number | null
        }
        Relationships: []
      }
      recent_engagement_view: {
        Row: {
          count: number | null
          event_type: string | null
          hour: string | null
        }
        Relationships: []
      }
      trending_content_view: {
        Row: {
          content_id: string | null
          content_type: string | null
          engagement_count: number | null
          title: string | null
        }
        Relationships: []
      }
      user_retention_view: {
        Row: {
          returning_users: number | null
          total_users: number | null
          week: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_connection_rate_limit: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_host_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          action: string
          entity_type: string
          entity_id: string
          details?: Json
        }
        Returns: undefined
      }
      record_engagement_event: {
        Args: { event_type: string; content_id: string; content_type: string }
        Returns: string
      }
      record_page_view: {
        Args: { page_path: string; content_id?: string; content_type?: string }
        Returns: string
      }
      update_user_role: {
        Args: {
          user_id: string
          new_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "visitor" | "tribe" | "host" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["visitor", "tribe", "host", "admin"],
    },
  },
} as const
