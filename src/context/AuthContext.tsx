'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (resetCode: string) => Promise<void>;
  updatePassword: (currentPassword: string, password: string, rePassword: string) => Promise<void>;
  verifyToken: () => Promise<boolean>;
  getAllUsers: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;

    const cachedUser = localStorage.getItem('user');
    if (!cachedUser) return null;

    try {
      return JSON.parse(cachedUser);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in localStorage
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        if (storedToken) {
          setToken(storedToken);

          // First try to use cached user data
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
            } catch {
              // Invalid cached user data, proceed with verification
            }
          }

          try {
            const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyToken', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`,
              },
            });

            if (response.ok) {
              try {
                const profileResponse = await fetch('https://ecommerce.routemisr.com/api/v1/users/profile', {
                  headers: {
                    'Authorization': `Bearer ${storedToken}`,
                  },
                });

                if (profileResponse.ok) {
                  const profileData = await profileResponse.json();
                  setUser(profileData.data);
                  localStorage.setItem('user', JSON.stringify(profileData.data));
                }
              } catch (profileError) {
                console.error('Profile fetch error:', profileError);
              }
            } else {
              // Token verification failed, clear it
              logout();
            }
          } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            // Keep token on network error - user might be offline
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        // Store in localStorage for persistence
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetCode = async (resetCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid reset code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, password: string, rePassword: string) => {
    if (!token) throw new Error('Not authenticated');

    setIsLoading(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, password, rePassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  const getAllUsers = async (): Promise<any[]> => {
    if (!token) throw new Error('Not authenticated');

    setIsLoading(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/users?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data.data || [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      forgotPassword,
      verifyResetCode,
      updatePassword,
      verifyToken,
      getAllUsers,
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