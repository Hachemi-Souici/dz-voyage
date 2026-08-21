// Types Supabase générés à la main à partir de
// supabase/migrations/0001_init.sql et 0002_post_details.sql. À
// régénérer avec `supabase gen types typescript` une fois le projet
// lié en CI. La forme (Tables/Views/Functions/Enums/CompositeTypes,
// Relationships par table) suit le contrat attendu par
// @supabase/supabase-js — s'en écarter fait retomber l'inférence de
// type sur `never`.

export type PostType = "nature" | "recette" | "lieu";
export type Region = "est" | "ouest" | "centre" | "sud";
export type PostStatus =
  | "en_attente"
  | "approuvee"
  | "rejetee"
  | "revision_manuelle";
export type ReactionType = "like" | "dislike";
export type NotificationType = "post_approved" | "post_pending";

/** Champs conditionnels selon `posts.type`, stockés dans `posts.details`. */
export type RecettePostDetails = {
  ingredients: string;
  steps: string;
  isDessert: boolean;
};
export type LieuPostDetails = {
  name: string;
  category: string;
};
export type PostDetails = RecettePostDetails | LieuPostDetails | Record<string, never>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          username: string;
          is_admin: boolean;
        }>;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          type: PostType;
          region: Region;
          title: string;
          body: string;
          status: PostStatus;
          details: PostDetails;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          type: PostType;
          region: Region;
          title: string;
          body: string;
          status?: PostStatus;
          details?: PostDetails;
          created_at?: string;
        };
        Update: Partial<{
          type: PostType;
          region: Region;
          title: string;
          body: string;
          status: PostStatus;
          details: PostDetails;
        }>;
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      post_photos: {
        Row: {
          id: string;
          post_id: string;
          storage_path: string;
          position: number;
        };
        Insert: {
          id?: string;
          post_id: string;
          storage_path: string;
          position?: number;
        };
        Update: Partial<{ storage_path: string; position: number }>;
        Relationships: [
          {
            foreignKeyName: "post_photos_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          id: string;
          post_id: string | null;
          region: Region;
          title: string;
          is_dessert: boolean;
          ingredients: string;
          steps: string;
          image_path: string | null;
          image_credit: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          region: Region;
          title: string;
          is_dessert?: boolean;
          ingredients: string;
          steps: string;
          image_path?: string | null;
          image_credit?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          region: Region;
          title: string;
          is_dessert: boolean;
          ingredients: string;
          steps: string;
          image_path: string | null;
          image_credit: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "recipes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      places: {
        Row: {
          id: string;
          post_id: string | null;
          region: Region;
          name: string;
          description: string;
          category: string | null;
          image_path: string | null;
          image_credit: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          region: Region;
          name: string;
          description: string;
          category?: string | null;
          image_path?: string | null;
          image_credit?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          region: Region;
          name: string;
          description: string;
          category: string | null;
          image_path: string | null;
          image_credit: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "places_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      festivals: {
        Row: {
          id: string;
          region: Region;
          name: string;
          description: string;
          period: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          region: Region;
          name: string;
          description: string;
          period?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          region: Region;
          name: string;
          description: string;
          period: string | null;
        }>;
        Relationships: [];
      };
      post_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction: ReactionType;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          reaction: ReactionType;
          created_at?: string;
        };
        Update: Partial<{ reaction: ReactionType }>;
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteer_requests: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          region: Region;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          region: Region;
          message?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          full_name: string;
          email: string;
          region: Region;
          message: string | null;
        }>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          type: NotificationType;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id?: string | null;
          type?: NotificationType;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<{ read: boolean }>;
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      post_type: PostType;
      region: Region;
      post_status: PostStatus;
      reaction_type: ReactionType;
    };
    CompositeTypes: Record<string, never>;
  };
}
