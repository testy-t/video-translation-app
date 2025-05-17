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
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          source_language: string
          target_language: string
          video_url: string | null
          output_url: string | null
          payment_id: string | null
          amount: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          source_language: string
          target_language: string
          video_url?: string | null
          output_url?: string | null
          payment_id?: string | null
          amount?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          source_language?: string
          target_language?: string
          video_url?: string | null
          output_url?: string | null
          payment_id?: string | null
          amount?: number | null
        }
      }
      languages: {
        Row: {
          id: number
          original_name: string
          ru_name: string
          iso_code: string
          flag_emoji: string | null
          is_active: boolean
        }
        Insert: {
          id?: number
          original_name: string
          ru_name: string
          iso_code: string
          flag_emoji?: string | null
          is_active?: boolean
        }
        Update: {
          id?: number
          original_name?: string
          ru_name?: string
          iso_code?: string
          flag_emoji?: string | null
          is_active?: boolean
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
