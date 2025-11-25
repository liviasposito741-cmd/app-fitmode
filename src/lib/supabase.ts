import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          quiz_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          quiz_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          quiz_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quiz_responses: {
        Row: {
          id: string
          user_id: string
          goal: string
          activity_level: string
          diet_preference: string
          health_conditions: string[]
          exercise_preferences: string[]
          experience_level: string
          available_days: number
          workout_duration: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal: string
          activity_level: string
          diet_preference: string
          health_conditions?: string[]
          exercise_preferences?: string[]
          experience_level: string
          available_days: number
          workout_duration: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal?: string
          activity_level?: string
          diet_preference?: string
          health_conditions?: string[]
          exercise_preferences?: string[]
          experience_level?: string
          available_days?: number
          workout_duration?: string
          created_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          exercises: any[]
          completed: boolean
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          exercises: any[]
          completed?: boolean
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          exercises?: any[]
          completed?: boolean
          date?: string
          created_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          meal_type: string
          food_name: string
          calories: number
          protein: number
          carbs: number
          fats: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: string
          food_name: string
          calories: number
          protein: number
          carbs: number
          fats: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_type?: string
          food_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fats?: number
          date?: string
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          author_name: string
          author_avatar: string | null
          content: string
          image_url: string | null
          likes: number
          comments_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          author_name: string
          author_avatar?: string | null
          content: string
          image_url?: string | null
          likes?: number
          comments_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          author_name?: string
          author_avatar?: string | null
          content?: string
          image_url?: string | null
          likes?: number
          comments_count?: number
          created_at?: string
        }
      }
    }
  }
}
