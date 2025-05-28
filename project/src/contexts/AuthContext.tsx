import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  type: 'education' | 'library';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, type: 'education' | 'library') => Promise<void>;
  register: (name: string, email: string, password: string, type: 'education' | 'library') => Promise<void>;
  logout: () => void;
  resetPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utilisateurs par défaut
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin Education',
    email: 'admin.edu@example.com',
    role: 'admin',
    type: 'education'
  },
  {
    id: '2',
    name: 'Admin Bibliothèque',
    email: 'admin.lib@example.com',
    role: 'admin',
    type: 'library'
  },
  {
    id: '3',
    name: 'Professeur Martin',
    email: 'prof@example.com',
    role: 'teacher',
    type: 'education'
  },
  {
    id: '4',
    name: 'Étudiant Dupont',
    email: 'etudiant@example.com',
    role: 'student',
    type: 'education'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Initialiser les utilisateurs par défaut au démarrage
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) {
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, type: 'education' | 'library') => {
    // Simuler une connexion
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.email === email && u.type === type);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Dans un vrai système, vous vérifieriez le mot de passe ici
    // Pour la démo, on accepte n'importe quel mot de passe
    
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Rediriger en fonction du rôle
    if (type === 'education') {
      if (user.role === 'admin') navigate('/education/admin');
      else if (user.role === 'teacher') navigate('/education/teacher');
      else navigate('/education/student');
    } else {
      if (user.role === 'admin') navigate('/library/admin');
      else navigate('/library/home');
    }
  };

  const register = async (name: string, email: string, password: string, type: 'education' | 'library') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    if (users.some(u => u.email === email && u.type === type)) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    const role = type === 'library' ? 'student' : 'admin' as const;
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      type
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    if (type === 'education') {
      navigate('/education/admin');
    } else {
      navigate('/library/home');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const resetPassword = async (password: string) => {
    // Simuler la réinitialisation du mot de passe
    navigate('/login/education');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}