export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_config: {
        Row: {
          default_model_id: string | null
          default_provider_id: string | null
          global_daily_limit: number | null
          id: string
          is_enabled: boolean | null
          teacher_daily_limit: number | null
          temperature: number | null
          timeout_seconds: number | null
          updated_at: string | null
          user_daily_limit: number | null
        }
        Insert: {
          default_model_id?: string | null
          default_provider_id?: string | null
          global_daily_limit?: number | null
          id?: string
          is_enabled?: boolean | null
          teacher_daily_limit?: number | null
          temperature?: number | null
          timeout_seconds?: number | null
          updated_at?: string | null
          user_daily_limit?: number | null
        }
        Update: {
          default_model_id?: string | null
          default_provider_id?: string | null
          global_daily_limit?: number | null
          id?: string
          is_enabled?: boolean | null
          teacher_daily_limit?: number | null
          temperature?: number | null
          timeout_seconds?: number | null
          updated_at?: string | null
          user_daily_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_config_default_model_id_fkey"
            columns: ["default_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_config_default_provider_id_fkey"
            columns: ["default_provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_daily_usage: {
        Row: {
          id: string
          total_requests: number | null
          total_tokens: number | null
          usage_date: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          total_requests?: number | null
          total_tokens?: number | null
          usage_date?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          total_requests?: number | null
          total_tokens?: number | null
          usage_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          cost_per_1k_input: number | null
          cost_per_1k_output: number | null
          created_at: string | null
          display_name: string
          id: string
          is_default: boolean | null
          max_tokens: number | null
          model_id: string
          provider_id: string | null
          supports_streaming: boolean | null
        }
        Insert: {
          cost_per_1k_input?: number | null
          cost_per_1k_output?: number | null
          created_at?: string | null
          display_name: string
          id?: string
          is_default?: boolean | null
          max_tokens?: number | null
          model_id: string
          provider_id?: string | null
          supports_streaming?: boolean | null
        }
        Update: {
          cost_per_1k_input?: number | null
          cost_per_1k_output?: number | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_default?: boolean | null
          max_tokens?: number | null
          model_id?: string
          provider_id?: string | null
          supports_streaming?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          api_endpoint: string | null
          created_at: string | null
          display_name: string
          id: string
          is_enabled: boolean | null
          name: string
          requires_api_key: boolean | null
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          is_enabled?: boolean | null
          name: string
          requires_api_key?: boolean | null
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_enabled?: boolean | null
          name?: string
          requires_api_key?: boolean | null
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          created_at: string | null
          id: string
          input_tokens: number | null
          model: string
          output_tokens: number | null
          provider: string
          request_type: string | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          model: string
          output_tokens?: number | null
          provider: string
          request_type?: string | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          model?: string
          output_tokens?: number | null
          provider?: string
          request_type?: string | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          quiz_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          quiz_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          quiz_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          quiz_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quiz_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          grade: string | null
          id: string
          phone: string | null
          school: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          phone?: string | null
          school?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          phone?: string | null
          school?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          bloom_level: string | null
          category: string | null
          correct_answer: string
          created_at: string
          difficulty: string | null
          embedding: string | null
          explanation: string | null
          id: string
          options: Json | null
          question_text: string
          question_type: string
          source_document_id: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bloom_level?: string | null
          category?: string | null
          correct_answer: string
          created_at?: string
          difficulty?: string | null
          embedding?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question_text: string
          question_type?: string
          source_document_id?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bloom_level?: string | null
          category?: string | null
          correct_answer?: string
          created_at?: string
          difficulty?: string | null
          embedding?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string
          source_document_id?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      question_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "question_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          options: Json | null
          order_index: number | null
          question_text: string
          question_type: string | null
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number | null
          question_text: string
          question_type?: string | null
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number | null
          question_text?: string
          question_type?: string | null
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          id: string
          quiz_id: string
          score: number | null
          started_at: string | null
          time_spent: number | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          quiz_id: string
          score?: number | null
          started_at?: string | null
          time_spent?: number | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          quiz_id?: string
          score?: number | null
          started_at?: string | null
          time_spent?: number | null
          total_questions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_ratings: {
        Row: {
          created_at: string
          id: string
          quiz_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quiz_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_ratings_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          completed_at: string | null
          id: string
          percentage: number
          quiz_id: string
          score: number
          time_spent: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          percentage: number
          quiz_id: string
          score: number
          time_spent?: number | null
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          percentage?: number
          quiz_id?: string
          score?: number
          time_spent?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          difficulty: string | null
          duration: number | null
          grade: string | null
          id: string
          is_new: boolean | null
          is_popular: boolean | null
          is_public: boolean | null
          is_published: boolean | null
          play_count: number | null
          rating: number | null
          subject: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          grade?: string | null
          id?: string
          is_new?: boolean | null
          is_popular?: boolean | null
          is_public?: boolean | null
          is_published?: boolean | null
          play_count?: number | null
          rating?: number | null
          subject?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          grade?: string | null
          id?: string
          is_new?: boolean | null
          is_popular?: boolean | null
          is_public?: boolean | null
          is_published?: boolean | null
          play_count?: number | null
          rating?: number | null
          subject?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_questions: {
        Args: {
          filter_user_id?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          bloom_level: string
          category: string
          correct_answer: string
          difficulty: string
          explanation: string
          id: string
          options: Json
          question_text: string
          question_type: string
          similarity: number
          tags: string[]
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "student"],
    },
  },
} as const
