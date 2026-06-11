import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.error(
    "Missing Supabase env vars – check .env.local and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
} else {
  // Intentionally do NOT log secrets (keys). Only confirm presence.
  console.info("Supabase env vars detected — Supabase client will be initialized.");
}

// If configuration is missing or clearly a placeholder, export a lightweight mock
// that provides the subset of the Supabase client API used in this project.
function createMockSupabase() {
  const noopPromise = async (result: any = null) => result;

  class MockTable {
    select(_sel?: string) {
      return this;
    }
    order(_col: string, _opts?: any) {
      return noopPromise({ data: null, error: { message: "Supabase not configured" } });
    }
    eq() {
      return { single: async () => ({ data: null, error: { message: "Supabase not configured" } }) };
    }
    insert() {
      return {
        select: () => ({ single: async () => ({ data: null, error: { message: "Supabase not configured" } }) }),
      };
    }
    update() {
      return {
        eq: (_col: string, _val: any) => noopPromise({ data: null, error: { message: "Supabase not configured" } }),
      };
    }
    delete() {
      return {
        eq: (_col: string, _val: any) => noopPromise({ data: null, error: { message: "Supabase not configured" } }),
      };
    }
  }

  const mock = {
    from: (_: string) => new MockTable(),
    auth: {
      signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
      getSession: async () => ({ data: {} }),
      onAuthStateChange: (_cb: any) => ({ data: null, error: null }),
      signOut: async () => ({}),
    },
    channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
    removeChannel: () => {},
  };

  return mock as any;
}

// Avoid initializing real client when configuration appears to be a placeholder
const isPlaceholder = (supabaseUrl || "").includes("your-project") || (supabaseAnonKey || "").includes("PASTE_YOUR_ANON_KEY");

export const supabase = hasSupabaseConfig && !isPlaceholder ? createClient(supabaseUrl ?? "", supabaseAnonKey ?? "") : createMockSupabase();
