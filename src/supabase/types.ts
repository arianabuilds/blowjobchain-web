import { MergeDeep } from "type-fest"
import { Database as DatabaseGenerated } from "./types-generated"
import { PushSubscription } from "web-push"

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        profiles: {
          Row: { push_notif_subscriptions: PushSubscription[] | null }
          Update: { push_notif_subscriptions?: PushSubscription[] }
        }
        points: {
          Row: {
            partial_resolutions: Tables<"partial_resolutions">[]
          }
        }
      }
      Functions: {
        get_partnerships_with_names: {
          Returns: {
            created_at: string
            inviter: string
            invitee: string

            // both nullable:
            inviter_name: string | null
            invitee_name: string | null
          }[]
        }
      }
    }
  }
>

type PublicSchema = Database[Extract<keyof Database, "public">]
/** `Tables<'table_name'>` shorthand, with our custom supplied types */
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
