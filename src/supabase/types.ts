import { MergeDeep } from "type-fest"
import { Database as DatabaseGenerated } from "./types-generated"

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
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
