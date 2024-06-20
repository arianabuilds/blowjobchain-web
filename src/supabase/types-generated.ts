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
      "entries (2022 archive)": {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          points: number | null
          signature: string | null
          who: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          points?: number | null
          signature?: string | null
          who?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          points?: number | null
          signature?: string | null
          who?: string | null
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          created_at: string
          invitee: string
          inviter: string
        }
        Insert: {
          created_at?: string
          invitee: string
          inviter: string
        }
        Update: {
          created_at?: string
          invitee?: string
          inviter?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnerships_invitee_fkey"
            columns: ["invitee"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerships_inviter_fkey"
            columns: ["inviter"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points: {
        Row: {
          amount: number
          comment: string | null
          created_at: string
          from: string
          id: number
          signature: string | null
          to: string
        }
        Insert: {
          amount: number
          comment?: string | null
          created_at?: string
          from: string
          id?: number
          signature?: string | null
          to: string
        }
        Update: {
          amount?: number
          comment?: string | null
          created_at?: string
          from?: string
          id?: number
          signature?: string | null
          to?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_partner: string | null
          name: string | null
          push_notif_subscriptions: Json[] | null
          user_id: string
        }
        Insert: {
          active_partner?: string | null
          name?: string | null
          push_notif_subscriptions?: Json[] | null
          user_id: string
        }
        Update: {
          active_partner?: string | null
          name?: string | null
          push_notif_subscriptions?: Json[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_partner_fkey"
            columns: ["active_partner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pub_keys: {
        Row: {
          created_at: string
          user_id: string
          value: string | null
        }
        Insert: {
          created_at?: string
          user_id: string
          value?: string | null
        }
        Update: {
          created_at?: string
          user_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pub_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_partnerships_with_names: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          inviter: string
          invitee: string
          inviter_name: string
          invitee_name: string
        }[]
      }
      get_user_id_by_email: {
        Args: {
          email: string
        }
        Returns: {
          id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
