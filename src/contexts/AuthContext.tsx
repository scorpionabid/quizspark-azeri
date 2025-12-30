import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Admin İstifadəçi',
    email: 'admin@quiz.az',
    role: 'admin',
  },
  teacher: {
    id: '2',
    name: 'Müəllim Əliyev',
    email: 'teacher@quiz.az',
    role: 'teacher',
  },
  student: {
    id: '3',
    name: 'Tələbə Həsənov',
    email: 'student@quiz.az',
    role: 'student',
  },
  guest: {
    id: '4',
    name: 'Qonaq',
    email: 'guest@quiz.az',
    role: 'guest',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    // Demo login - in production, this would validate credentials
    setUser(demoUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
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
