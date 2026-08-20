// Types Supabase générés à la main à partir de
// supabase/migrations/0001_init.sql. À régénérer avec
// `supabase gen types typescript` une fois le projet lié en CI.

export type PostType = "nature" | "recette" | "lieu";
export type Region = "est" | "ouest" | "centre" | "sud";
export type PostStatus =
  | "en_attente"
  | "approuvee"
  | "rejetee"
  | "revision_manuelle";
export type ReactionType = "like" | "dislike";

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
          created_at?: string;
        };
        Update: Partial<{
          type: PostType;
          region: Region;
          title: string;
          body: string;
          status: PostStatus;
        }>;
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
          created_at?: string;
        };
        Update: Partial<{
          region: Region;
          title: string;
          is_dessert: boolean;
          ingredients: string;
          steps: string;
          image_path: string | null;
        }>;
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
          created_at?: string;
        };
        Update: Partial<{
          region: Region;
          name: string;
          description: string;
          category: string | null;
          image_path: string | null;
        }>;
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
        Update: never;
      };
    };
  };
}
