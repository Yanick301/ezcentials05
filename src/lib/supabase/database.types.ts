// Types générés pour Supabase Database
// Vous pouvez générer ces types automatiquement avec: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          photo_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          photo_url?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          photo_url?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          name_fr: string;
          name_en: string;
          slug: string;
          price: number;
          old_price: number | null;
          description: string;
          description_fr: string;
          description_en: string;
          category: string;
          images: string[];
          sizes: string[] | null;
          colors: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          name_fr: string;
          name_en: string;
          slug: string;
          price: number;
          old_price?: number | null;
          description: string;
          description_fr: string;
          description_en: string;
          category: string;
          images?: string[];
          sizes?: string[] | null;
          colors?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_fr?: string;
          name_en?: string;
          slug?: string;
          price?: number;
          old_price?: number | null;
          description?: string;
          description_fr?: string;
          description_en?: string;
          category?: string;
          images?: string[];
          sizes?: string[] | null;
          colors?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          user_name: string;
          rating: number;
          comment: string;
          comment_fr: string | null;
          comment_en: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          user_name: string;
          rating: number;
          comment: string;
          comment_fr?: string | null;
          comment_en?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          user_name?: string;
          rating?: number;
          comment?: string;
          comment_fr?: string | null;
          comment_en?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          shipping_info: Json;
          items: Json;
          subtotal: number;
          shipping: number;
          taxes: number;
          total_amount: number;
          order_date: string;
          payment_status: 'pending' | 'processing' | 'completed' | 'rejected';
          receipt_image_url: string | null;
          shipping_status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
          tracking_number: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shipping_info: Json;
          items: Json;
          subtotal: number;
          shipping: number;
          taxes: number;
          total_amount: number;
          order_date?: string;
          payment_status?: 'pending' | 'processing' | 'completed' | 'rejected';
          receipt_image_url?: string | null;
          shipping_status?: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shipping_info?: Json;
          items?: Json;
          subtotal?: number;
          shipping?: number;
          taxes?: number;
          total_amount?: number;
          order_date?: string;
          payment_status?: 'pending' | 'processing' | 'completed' | 'rejected';
          receipt_image_url?: string | null;
          shipping_status?: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      receipts: {
        Row: {
          id: string;
          order_id: string | null;
          user_id: string;
          receipt_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          user_id: string;
          receipt_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          user_id?: string;
          receipt_url?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}












