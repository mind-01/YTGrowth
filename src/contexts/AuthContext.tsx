import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  savedTools: string[];
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleSaveTool: (toolId: string) => Promise<void>;
  isSaved: (toolId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedTools, setSavedTools] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSavedTools(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSavedTools(session.user.id);
      } else {
        setSavedTools([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSavedTools = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('saved_tools')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching saved tools:', error.message);
      }

      if (data) {
        const tools = Array.isArray(data.saved_tools) ? data.saved_tools : [];
        setSavedTools(tools);
      } else {
        // Initialize profile if it doesn't exist
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ 
            id: userId, 
            saved_tools: []
          }, { onConflict: 'id' });
        
        if (upsertError) {
          console.error('Error initializing profile:', upsertError.message);
        }
        setSavedTools([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching saved tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      alert("Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the environment variables.");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSaveTool = async (toolId: string) => {
    if (!supabase || !user) return;

    const isAlreadySaved = savedTools.includes(toolId);
    const nextTools = isAlreadySaved
      ? savedTools.filter(id => id !== toolId)
      : [...savedTools, toolId];
    
    const previousTools = [...savedTools];

    // Optimistic update
    setSavedTools(nextTools);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          saved_tools: nextTools
        }, { onConflict: 'id' });

      if (error) {
        console.error('Error toggling saved tool (Supabase):', error.message);
        setSavedTools(previousTools); // Rollback
        throw error;
      }
    } catch (error) {
      console.error('Error toggling saved tool (Unexpected):', error);
      setSavedTools(previousTools); // Rollback
      throw error;
    }
  };

  const isSaved = (toolId: string) => savedTools.includes(toolId);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      savedTools, 
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      logout, 
      toggleSaveTool,
      isSaved
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
