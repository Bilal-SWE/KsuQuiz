export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'owner' | 'admin' | 'student';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: 'owner' | 'admin' | 'student';
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: 'owner' | 'admin' | 'student';
          created_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          name_normalized: string;
          description: string | null;
          cover_image: string | null;
          status: 'draft' | 'published';
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_normalized: string;
          description?: string | null;
          cover_image?: string | null;
          status?: 'draft' | 'published';
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_normalized?: string;
          description?: string | null;
          cover_image?: string | null;
          status?: 'draft' | 'published';
          created_by?: string;
          updated_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          sort_order: number;
          status: 'draft' | 'published' | 'soon';
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          sort_order: number;
          status?: 'draft' | 'published' | 'soon';
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          sort_order?: number;
          status?: 'draft' | 'published' | 'soon';
          created_by?: string;
          updated_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          lesson_id: string;
          type: 'mcq' | 'true_false' | 'fill_blanks';
          content: Json;
          explanation: string | null;
          sort_order: number;
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          type: 'mcq' | 'true_false' | 'fill_blanks';
          content: Json;
          explanation?: string | null;
          sort_order: number;
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          type?: 'mcq' | 'true_false' | 'fill_blanks';
          content?: Json;
          explanation?: string | null;
          sort_order?: number;
          created_by?: string;
          updated_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          student_id: string;
          subject_id: string;
          added_at: string;
        };
        Insert: {
          student_id: string;
          subject_id: string;
          added_at?: string;
        };
        Update: {
          student_id?: string;
          subject_id?: string;
          added_at?: string;
        };
      };
      attempts: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          mode: 'exam' | 'practice';
          score: number | null;
          total: number | null;
          started_at: string;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          mode: 'exam' | 'practice';
          score?: number | null;
          total?: number | null;
          started_at?: string;
          finished_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          lesson_id?: string;
          mode?: 'exam' | 'practice';
          score?: number | null;
          total?: number | null;
          started_at?: string;
          finished_at?: string | null;
        };
      };
      answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          response: Json;
          is_correct: boolean | null;
          answered_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          response: Json;
          is_correct?: boolean | null;
          answered_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          response?: Json;
          is_correct?: boolean | null;
          answered_at?: string;
        };
      };
    };
    Functions: {
      normalize_arabic: {
        Args: { input_text: string };
        Returns: string;
      };
    };
  };
};
