export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; phone: string | null; avatar_url: string | null; created_at: string; updated_at: string };
        Insert: { id: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null };
        Update: { full_name?: string | null; phone?: string | null; avatar_url?: string | null; updated_at?: string };
      };
      roles: {
        Row: { id: string; user_id: string; role: "admin" | "staff" | "customer"; created_at: string };
        Insert: { user_id: string; role?: "admin" | "staff" | "customer" };
        Update: { role?: "admin" | "staff" | "customer" };
      };
      service_categories: {
        Row: { id: string; name: string; slug: string; description: string | null; display_order: number; enabled: boolean; created_at: string; updated_at: string };
        Insert: { name: string; slug: string; description?: string | null; display_order?: number; enabled?: boolean };
        Update: Partial<Database["public"]["Tables"]["service_categories"]["Insert"]>;
      };
      services: {
        Row: { id: string; category_id: string; name: string; slug: string; description: string | null; image_path: string | null; enabled: boolean; display_order: number; created_at: string; updated_at: string };
        Insert: { category_id: string; name: string; slug: string; description?: string | null; image_path?: string | null; enabled?: boolean; display_order?: number };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      offers: {
        Row: { id: string; title: string; description: string | null; image_path: string | null; expires_at: string | null; enabled: boolean; created_at: string; updated_at: string };
        Insert: { title: string; description?: string | null; image_path?: string | null; expires_at?: string | null; enabled?: boolean };
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>;
      };
      gallery: {
        Row: { id: string; title: string; alt_text: string | null; image_path: string; category: string | null; enabled: boolean; display_order: number; created_at: string; updated_at: string };
        Insert: { title: string; alt_text?: string | null; image_path: string; category?: string | null; enabled?: boolean; display_order?: number };
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      appointments: {
        Row: { id: string; customer_name: string; phone: string; service_id: string | null; service_name: string; appointment_date: string; appointment_time: string; notes: string | null; status: "pending" | "confirmed" | "completed" | "cancelled"; created_by: string | null; created_at: string; updated_at: string };
        Insert: { customer_name: string; phone: string; service_id?: string | null; service_name: string; appointment_date: string; appointment_time: string; notes?: string | null; status?: "pending" | "confirmed" | "completed" | "cancelled"; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
      };
      settings: {
        Row: { key: string; value: Json; updated_by: string | null; updated_at: string };
        Insert: { key: string; value: Json; updated_by?: string | null };
        Update: { value?: Json; updated_by?: string | null; updated_at?: string };
      };
      audit_logs: {
        Row: { id: string; actor_id: string | null; action: string; table_name: string; record_id: string | null; before_data: Json | null; after_data: Json | null; created_at: string };
        Insert: { actor_id?: string | null; action: string; table_name: string; record_id?: string | null; before_data?: Json | null; after_data?: Json | null };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "admin" | "staff" | "customer";
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled";
    };
    CompositeTypes: Record<string, never>;
  };
};
