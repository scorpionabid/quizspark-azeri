export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
      ai_model_aliases: {
        Row: {
          alias_key: string
          created_at: string | null
          description: string | null
          id: string
          model_id: string | null
          updated_at: string | null
        }
        Insert: {
          alias_key: string
          created_at?: string | null
          description?: string | null
          id?: string
          model_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alias_key?: string
          created_at?: string | null
          description?: string | null
          id?: string
          model_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_aliases_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
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
          ai_daily_limit: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          grade: string | null
          id: string
          is_profile_complete: boolean
          last_active_at: string | null
          level: number | null
          phone: string | null
          school: string | null
          status: string | null
          streak_count: number | null
          subscription_tier: string
          updated_at: string | null
          user_id: string
          xp_points: number | null
        }
        Insert: {
          ai_daily_limit?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          is_profile_complete?: boolean
          last_active_at?: string | null
          level?: number | null
          phone?: string | null
          school?: string | null
          status?: string | null
          streak_count?: number | null
          subscription_tier?: string
          updated_at?: string | null
          user_id: string
          xp_points?: number | null
        }
        Update: {
          ai_daily_limit?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          is_profile_complete?: boolean
          last_active_at?: string | null
          level?: number | null
          phone?: string | null
          school?: string | null
          status?: string | null
          streak_count?: number | null
          subscription_tier?: string
          updated_at?: string | null
          user_id?: string
          xp_points?: number | null
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          accepted_answers: string[] | null
          ai_grading_enabled: boolean
          ai_grading_prompt: string | null
          alt_text: string | null
          answer_case_sensitive: boolean
          answer_match_type: string
          answer_trim_spaces: boolean
          audio_playback_limit: number | null
          audio_transcript: string | null
          bloom_level: string | null
          category: string | null
          code_language: string | null
          code_memory_limit_mb: number | null
          code_starter_template: string | null
          code_test_cases: Json | null
          code_time_limit_ms: number | null
          correct_answer: string
          correct_option_indices: number[] | null
          created_at: string
          curriculum_standard: string | null
          diagram_labels: Json | null
          difficulty: string | null
          embedding: string | null
          essay_max_words: number | null
          essay_min_words: number | null
          essay_rubric: Json | null
          explanation: string | null
          feedback_correct: string | null
          feedback_enabled: boolean | null
          feedback_incorrect: string | null
          fill_blank_answers: Json | null
          fill_blank_case_sensitive: boolean
          fill_blank_template: string | null
          hint: string | null
          hotspot_data: Json | null
          hotspot_tolerance_px: number | null
          hotspot_type: string
          id: string
          is_graded: boolean
          is_required: boolean
          learning_objective: string | null
          likert_max_label: string | null
          likert_min_label: string | null
          likert_scale: number | null
          matching_left_media: Json | null
          matching_left_type: string
          matching_pairs: Json | null
          matching_right_media: Json | null
          matching_right_type: string
          matrix_columns: Json | null
          matrix_correct_answers: Json | null
          matrix_rows: Json | null
          max_attempts: number | null
          media_type: string | null
          media_url: string | null
          model_3d_type: string | null
          model_3d_url: string | null
          numerical_answer: number | null
          numerical_tolerance: number | null
          objective_id: string | null
          option_images: Json | null
          options: Json | null
          partial_credit_config: Json | null
          partial_credit_enabled: boolean
          per_option_explanations: Json | null
          quality_score: number | null
          question_image_url: string | null
          question_text: string
          question_type: string
          read_aloud_text: string | null
          sequence_items: Json | null
          show_hint_after_attempts: number | null
          shuffle_options: boolean
          source_document_id: string | null
          tags: string[] | null
          time_limit: number | null
          title: string | null
          topic: string | null
          updated_at: string
          usage_count: number | null
          user_id: string | null
          video_end_time: number | null
          video_start_time: number | null
          video_url: string | null
          weight: number | null
        }
        Insert: {
          accepted_answers?: string[] | null
          ai_grading_enabled?: boolean
          ai_grading_prompt?: string | null
          alt_text?: string | null
          answer_case_sensitive?: boolean
          answer_match_type?: string
          answer_trim_spaces?: boolean
          audio_playback_limit?: number | null
          audio_transcript?: string | null
          bloom_level?: string | null
          category?: string | null
          code_language?: string | null
          code_memory_limit_mb?: number | null
          code_starter_template?: string | null
          code_test_cases?: Json | null
          code_time_limit_ms?: number | null
          correct_answer: string
          correct_option_indices?: number[] | null
          created_at?: string
          curriculum_standard?: string | null
          diagram_labels?: Json | null
          difficulty?: string | null
          embedding?: string | null
          essay_max_words?: number | null
          essay_min_words?: number | null
          essay_rubric?: Json | null
          explanation?: string | null
          feedback_correct?: string | null
          feedback_enabled?: boolean | null
          feedback_incorrect?: string | null
          fill_blank_answers?: Json | null
          fill_blank_case_sensitive?: boolean
          fill_blank_template?: string | null
          hint?: string | null
          hotspot_data?: Json | null
          hotspot_tolerance_px?: number | null
          hotspot_type?: string
          id?: string
          is_graded?: boolean
          is_required?: boolean
          learning_objective?: string | null
          likert_max_label?: string | null
          likert_min_label?: string | null
          likert_scale?: number | null
          matching_left_media?: Json | null
          matching_left_type?: string
          matching_pairs?: Json | null
          matching_right_media?: Json | null
          matching_right_type?: string
          matrix_columns?: Json | null
          matrix_correct_answers?: Json | null
          matrix_rows?: Json | null
          max_attempts?: number | null
          media_type?: string | null
          media_url?: string | null
          model_3d_type?: string | null
          model_3d_url?: string | null
          numerical_answer?: number | null
          numerical_tolerance?: number | null
          objective_id?: string | null
          option_images?: Json | null
          options?: Json | null
          partial_credit_config?: Json | null
          partial_credit_enabled?: boolean
          per_option_explanations?: Json | null
          quality_score?: number | null
          question_image_url?: string | null
          question_text: string
          question_type?: string
          read_aloud_text?: string | null
          sequence_items?: Json | null
          show_hint_after_attempts?: number | null
          shuffle_options?: boolean
          source_document_id?: string | null
          tags?: string[] | null
          time_limit?: number | null
          title?: string | null
          topic?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
          video_end_time?: number | null
          video_start_time?: number | null
          video_url?: string | null
          weight?: number | null
        }
        Update: {
          accepted_answers?: string[] | null
          ai_grading_enabled?: boolean
          ai_grading_prompt?: string | null
          alt_text?: string | null
          answer_case_sensitive?: boolean
          answer_match_type?: string
          answer_trim_spaces?: boolean
          audio_playback_limit?: number | null
          audio_transcript?: string | null
          bloom_level?: string | null
          category?: string | null
          code_language?: string | null
          code_memory_limit_mb?: number | null
          code_starter_template?: string | null
          code_test_cases?: Json | null
          code_time_limit_ms?: number | null
          correct_answer?: string
          correct_option_indices?: number[] | null
          created_at?: string
          curriculum_standard?: string | null
          diagram_labels?: Json | null
          difficulty?: string | null
          embedding?: string | null
          essay_max_words?: number | null
          essay_min_words?: number | null
          essay_rubric?: Json | null
          explanation?: string | null
          feedback_correct?: string | null
          feedback_enabled?: boolean | null
          feedback_incorrect?: string | null
          fill_blank_answers?: Json | null
          fill_blank_case_sensitive?: boolean
          fill_blank_template?: string | null
          hint?: string | null
          hotspot_data?: Json | null
          hotspot_tolerance_px?: number | null
          hotspot_type?: string
          id?: string
          is_graded?: boolean
          is_required?: boolean
          learning_objective?: string | null
          likert_max_label?: string | null
          likert_min_label?: string | null
          likert_scale?: number | null
          matching_left_media?: Json | null
          matching_left_type?: string
          matching_pairs?: Json | null
          matching_right_media?: Json | null
          matching_right_type?: string
          matrix_columns?: Json | null
          matrix_correct_answers?: Json | null
          matrix_rows?: Json | null
          max_attempts?: number | null
          media_type?: string | null
          media_url?: string | null
          model_3d_type?: string | null
          model_3d_url?: string | null
          numerical_answer?: number | null
          numerical_tolerance?: number | null
          objective_id?: string | null
          option_images?: Json | null
          options?: Json | null
          partial_credit_config?: Json | null
          partial_credit_enabled?: boolean
          per_option_explanations?: Json | null
          quality_score?: number | null
          question_image_url?: string | null
          question_text?: string
          question_type?: string
          read_aloud_text?: string | null
          sequence_items?: Json | null
          show_hint_after_attempts?: number | null
          shuffle_options?: boolean
          source_document_id?: string | null
          tags?: string[] | null
          time_limit?: number | null
          title?: string | null
          topic?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
          video_end_time?: number | null
          video_start_time?: number | null
          video_url?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "learning_objectives"
            referencedColumns: ["id"]
          },
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
      question_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          issue_type: string | null
          question_bank_id: string | null
          quiz_question_id: string | null
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          issue_type?: string | null
          question_bank_id?: string | null
          quiz_question_id?: string | null
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          issue_type?: string | null
          question_bank_id?: string | null
          quiz_question_id?: string | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_ratings_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_ratings_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          accepted_answers: string[] | null
          ai_grading_enabled: boolean
          ai_grading_prompt: string | null
          alt_text: string | null
          answer_case_sensitive: boolean
          answer_match_type: string
          answer_trim_spaces: boolean
          audio_playback_limit: number | null
          audio_transcript: string | null
          code_language: string | null
          code_memory_limit_mb: number | null
          code_starter_template: string | null
          code_test_cases: Json | null
          code_time_limit_ms: number | null
          correct_answer: string
          correct_option_indices: number[] | null
          created_at: string | null
          curriculum_standard: string | null
          diagram_labels: Json | null
          essay_max_words: number | null
          essay_min_words: number | null
          essay_rubric: Json | null
          explanation: string | null
          feedback_correct: string | null
          feedback_incorrect: string | null
          fill_blank_answers: Json | null
          fill_blank_case_sensitive: boolean
          fill_blank_template: string | null
          hint: string | null
          hotspot_data: Json | null
          hotspot_tolerance_px: number | null
          hotspot_type: string
          id: string
          is_graded: boolean
          is_required: boolean
          learning_objective: string | null
          likert_max_label: string | null
          likert_min_label: string | null
          likert_scale: number | null
          matching_left_media: Json | null
          matching_left_type: string
          matching_pairs: Json | null
          matching_right_media: Json | null
          matching_right_type: string
          matrix_columns: Json | null
          matrix_correct_answers: Json | null
          matrix_rows: Json | null
          max_attempts: number | null
          media_type: string | null
          media_url: string | null
          model_3d_type: string | null
          model_3d_url: string | null
          numerical_answer: number | null
          numerical_tolerance: number | null
          option_images: Json | null
          options: Json | null
          order_index: number | null
          partial_credit_config: Json | null
          partial_credit_enabled: boolean
          per_option_explanations: Json | null
          question_image_url: string | null
          question_text: string
          question_type: string | null
          quiz_id: string
          read_aloud_text: string | null
          section_id: string | null
          sequence_items: Json | null
          show_hint_after_attempts: number | null
          shuffle_options: boolean
          time_limit: number | null
          title: string | null
          topic: string | null
          video_end_time: number | null
          video_start_time: number | null
          video_url: string | null
          weight: number | null
        }
        Insert: {
          accepted_answers?: string[] | null
          ai_grading_enabled?: boolean
          ai_grading_prompt?: string | null
          alt_text?: string | null
          answer_case_sensitive?: boolean
          answer_match_type?: string
          answer_trim_spaces?: boolean
          audio_playback_limit?: number | null
          audio_transcript?: string | null
          code_language?: string | null
          code_memory_limit_mb?: number | null
          code_starter_template?: string | null
          code_test_cases?: Json | null
          code_time_limit_ms?: number | null
          correct_answer: string
          correct_option_indices?: number[] | null
          created_at?: string | null
          curriculum_standard?: string | null
          diagram_labels?: Json | null
          essay_max_words?: number | null
          essay_min_words?: number | null
          essay_rubric?: Json | null
          explanation?: string | null
          feedback_correct?: string | null
          feedback_incorrect?: string | null
          fill_blank_answers?: Json | null
          fill_blank_case_sensitive?: boolean
          fill_blank_template?: string | null
          hint?: string | null
          hotspot_data?: Json | null
          hotspot_tolerance_px?: number | null
          hotspot_type?: string
          id?: string
          is_graded?: boolean
          is_required?: boolean
          learning_objective?: string | null
          likert_max_label?: string | null
          likert_min_label?: string | null
          likert_scale?: number | null
          matching_left_media?: Json | null
          matching_left_type?: string
          matching_pairs?: Json | null
          matching_right_media?: Json | null
          matching_right_type?: string
          matrix_columns?: Json | null
          matrix_correct_answers?: Json | null
          matrix_rows?: Json | null
          max_attempts?: number | null
          media_type?: string | null
          media_url?: string | null
          model_3d_type?: string | null
          model_3d_url?: string | null
          numerical_answer?: number | null
          numerical_tolerance?: number | null
          option_images?: Json | null
          options?: Json | null
          order_index?: number | null
          partial_credit_config?: Json | null
          partial_credit_enabled?: boolean
          per_option_explanations?: Json | null
          question_image_url?: string | null
          question_text: string
          question_type?: string | null
          quiz_id: string
          read_aloud_text?: string | null
          section_id?: string | null
          sequence_items?: Json | null
          show_hint_after_attempts?: number | null
          shuffle_options?: boolean
          time_limit?: number | null
          title?: string | null
          topic?: string | null
          video_end_time?: number | null
          video_start_time?: number | null
          video_url?: string | null
          weight?: number | null
        }
        Update: {
          accepted_answers?: string[] | null
          ai_grading_enabled?: boolean
          ai_grading_prompt?: string | null
          alt_text?: string | null
          answer_case_sensitive?: boolean
          answer_match_type?: string
          answer_trim_spaces?: boolean
          audio_playback_limit?: number | null
          audio_transcript?: string | null
          code_language?: string | null
          code_memory_limit_mb?: number | null
          code_starter_template?: string | null
          code_test_cases?: Json | null
          code_time_limit_ms?: number | null
          correct_answer?: string
          correct_option_indices?: number[] | null
          created_at?: string | null
          curriculum_standard?: string | null
          diagram_labels?: Json | null
          essay_max_words?: number | null
          essay_min_words?: number | null
          essay_rubric?: Json | null
          explanation?: string | null
          feedback_correct?: string | null
          feedback_incorrect?: string | null
          fill_blank_answers?: Json | null
          fill_blank_case_sensitive?: boolean
          fill_blank_template?: string | null
          hint?: string | null
          hotspot_data?: Json | null
          hotspot_tolerance_px?: number | null
          hotspot_type?: string
          id?: string
          is_graded?: boolean
          is_required?: boolean
          learning_objective?: string | null
          likert_max_label?: string | null
          likert_min_label?: string | null
          likert_scale?: number | null
          matching_left_media?: Json | null
          matching_left_type?: string
          matching_pairs?: Json | null
          matching_right_media?: Json | null
          matching_right_type?: string
          matrix_columns?: Json | null
          matrix_correct_answers?: Json | null
          matrix_rows?: Json | null
          max_attempts?: number | null
          media_type?: string | null
          media_url?: string | null
          model_3d_type?: string | null
          model_3d_url?: string | null
          numerical_answer?: number | null
          numerical_tolerance?: number | null
          option_images?: Json | null
          options?: Json | null
          order_index?: number | null
          partial_credit_config?: Json | null
          partial_credit_enabled?: boolean
          per_option_explanations?: Json | null
          question_image_url?: string | null
          question_text?: string
          question_type?: string | null
          quiz_id?: string
          read_aloud_text?: string | null
          section_id?: string | null
          sequence_items?: Json | null
          show_hint_after_attempts?: number | null
          shuffle_options?: boolean
          time_limit?: number | null
          title?: string | null
          topic?: string | null
          video_end_time?: number | null
          video_start_time?: number | null
          video_url?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "quiz_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      answer_reviews: {
        Row: {
          ai_feedback: string | null
          ai_score: number | null
          attempt_id: string
          awarded_score: number | null
          comments: string | null
          id: string
          max_score: number | null
          question_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          rubric_scores: Json | null
          status: string
          student_answer: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          ai_feedback?: string | null
          ai_score?: number | null
          attempt_id: string
          awarded_score?: number | null
          comments?: string | null
          id?: string
          max_score?: number | null
          question_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          rubric_scores?: Json | null
          status?: string
          student_answer?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          ai_feedback?: string | null
          ai_score?: number | null
          attempt_id?: string
          awarded_score?: number | null
          comments?: string | null
          id?: string
          max_score?: number | null
          question_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          rubric_scores?: Json | null
          status?: string
          student_answer?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_reviews_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_reviews_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      learning_objectives: {
        Row: {
          bloom_level: string | null
          created_at: string
          curriculum: string | null
          description: string | null
          grade: string | null
          id: string
          subject: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bloom_level?: string | null
          created_at?: string
          curriculum?: string | null
          description?: string | null
          grade?: string | null
          id?: string
          subject?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bloom_level?: string | null
          created_at?: string
          curriculum?: string | null
          description?: string | null
          grade?: string | null
          id?: string
          subject?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_objectives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      question_revisions: {
        Row: {
          change_summary: string | null
          changed_by: string | null
          created_at: string
          id: string
          question_bank_id: string
          revision_number: number
          snapshot: Json
        }
        Insert: {
          change_summary?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          question_bank_id: string
          revision_number?: number
          snapshot: Json
        }
        Update: {
          change_summary?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          question_bank_id?: string
          revision_number?: number
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "question_revisions_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "question_revisions_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_prerequisites: {
        Row: {
          created_at: string
          id: string
          min_score: number
          prerequisite_id: string
          quiz_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_score?: number
          prerequisite_id: string
          quiz_id: string
        }
        Update: {
          created_at?: string
          id?: string
          min_score?: number
          prerequisite_id?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_prerequisites_prerequisite_id_fkey"
            columns: ["prerequisite_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_prerequisites_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_index: number
          pass_score: number | null
          quiz_id: string
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          pass_score?: number | null
          quiz_id: string
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          pass_score?: number | null
          quiz_id?: string
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sections_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_mastery: {
        Row: {
          attempt_count: number
          bloom_level: string | null
          category: string
          correct_count: number
          id: string
          last_practiced: string | null
          next_review_at: string | null
          student_id: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          bloom_level?: string | null
          category: string
          correct_count?: number
          id?: string
          last_practiced?: string | null
          next_review_at?: string | null
          student_id: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          bloom_level?: string | null
          category?: string
          correct_count?: number
          id?: string
          last_practiced?: string | null
          next_review_at?: string | null
          student_id?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_mastery_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          bookmarked_questions: string[] | null
          completed_at: string | null
          device_type: string | null
          hint_used_questions: string[] | null
          id: string
          question_timings: Json | null
          quiz_id: string
          score: number | null
          started_at: string | null
          time_spent: number | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          bookmarked_questions?: string[] | null
          completed_at?: string | null
          device_type?: string | null
          hint_used_questions?: string[] | null
          id?: string
          question_timings?: Json | null
          quiz_id: string
          score?: number | null
          started_at?: string | null
          time_spent?: number | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          bookmarked_questions?: string[] | null
          completed_at?: string | null
          device_type?: string | null
          hint_used_questions?: string[] | null
          id?: string
          question_timings?: Json | null
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
          access_password: string | null
          allow_backtracking: boolean
          allow_bookmarks: boolean
          attempts_limit: number | null
          auto_advance: boolean | null
          available_from: string | null
          available_to: string | null
          background_image_url: string | null
          cover_image_url: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          difficulty: string | null
          duration: number | null
          grade: string | null
          id: string
          is_archived: boolean
          is_new: boolean | null
          is_popular: boolean | null
          is_public: boolean | null
          is_published: boolean | null
          pass_percentage: number | null
          play_count: number | null
          questions_per_page: number
          rating: number | null
          show_feedback: boolean | null
          show_question_nav: boolean
          shuffle_questions: boolean | null
          strict_mode: boolean
          subject: string | null
          time_bonus_enabled: boolean | null
          time_penalty_enabled: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          access_password?: string | null
          allow_backtracking?: boolean
          allow_bookmarks?: boolean
          attempts_limit?: number | null
          auto_advance?: boolean | null
          available_from?: string | null
          available_to?: string | null
          background_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          grade?: string | null
          id?: string
          is_archived?: boolean
          is_new?: boolean | null
          is_popular?: boolean | null
          is_public?: boolean | null
          is_published?: boolean | null
          pass_percentage?: number | null
          play_count?: number | null
          questions_per_page?: number
          rating?: number | null
          show_feedback?: boolean | null
          show_question_nav?: boolean
          shuffle_questions?: boolean | null
          strict_mode?: boolean
          subject?: string | null
          time_bonus_enabled?: boolean | null
          time_penalty_enabled?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          access_password?: string | null
          allow_backtracking?: boolean
          allow_bookmarks?: boolean
          attempts_limit?: number | null
          auto_advance?: boolean | null
          available_from?: string | null
          available_to?: string | null
          background_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          grade?: string | null
          id?: string
          is_archived?: boolean
          is_new?: boolean | null
          is_popular?: boolean | null
          is_public?: boolean | null
          is_published?: boolean | null
          pass_percentage?: number | null
          play_count?: number | null
          questions_per_page?: number
          rating?: number | null
          show_feedback?: boolean | null
          show_question_nav?: boolean
          shuffle_questions?: boolean | null
          strict_mode?: boolean
          subject?: string | null
          time_bonus_enabled?: boolean | null
          time_penalty_enabled?: boolean | null
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
      support_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_receiver_id_profiles_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_messages_sender_id_profiles_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      admin_ai_usage_monitoring: {
        Row: {
          effective_limit: number | null
          email: string | null
          full_name: string | null
          id: string | null
          total_requests: number | null
          total_tokens: number | null
          usage_date: string | null
          user_id: string | null
        }
        Relationships: []
      }
      student_mastery_with_level: {
        Row: {
          attempt_count: number | null
          bloom_level: string | null
          category: string | null
          correct_count: number | null
          id: string | null
          last_practiced: string | null
          mastery_level: number | null
          next_review_at: string | null
          student_id: string | null
          topic: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_admin_conversations: {
        Args: never
        Returns: {
          avatar_url: string
          full_name: string
          last_message: string
          last_message_at: string
          unread_count: number
          user_id: string
        }[]
      }
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
      select_oauth_role: {
        Args: { p_phone?: string; p_role: string }
        Returns: undefined
      }
      update_subscription_tier: {
        Args: { p_tier: string; p_user_id: string }
        Returns: undefined
      }
      update_user_gamification: { Args: { p_xp_gain: number }; Returns: Json }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "teacher", "student"],
    },
  },
} as const

