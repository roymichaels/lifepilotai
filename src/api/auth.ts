import { supabase } from '../lib/supabase';

// Description: Login user functionality
// Endpoint: POST /auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }
  return data;
};

// Description: Register user functionality
// Endpoint: POST /auth/register
// Request: { email: string, password: string }
// Response: { email: string }
export const register = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Register error:', error);
    throw new Error(error.message);
  }
  return data;
};

// Description: Logout
// Endpoint: POST /auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
    throw new Error(error.message);
  }
  return { success: true };
};
