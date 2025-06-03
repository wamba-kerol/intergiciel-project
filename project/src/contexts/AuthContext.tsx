import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  type: 'education' | 'library';
  password: string;
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

// Exemples d'utilisateurs pour la connexion
const defaultUsers: User[] = [
  // Utilisateurs éducation
  {
    id: '1',
    name: 'Admin Education',
    email: 'admin.edu@uds.cm',
    role: 'admin',
    type: 'education',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'Professeur Martin',
    email: 'prof.martin@uds.cm',
    role: 'teacher',
    type: 'education',
    password: 'prof123'
  },
  {
    id: '3',
    name: 'Etudiant Jean',
    email: 'jean.student@uds.cm',
    role: 'student',
    type: 'education',
    password: 'student123'
  },
  
  // Utilisateurs bibliothèque
  {
    id: '4',
    name: 'Admin Bibliothèque',
    email: 'admin.lib@uds.cm',
    role: 'admin',
    type: 'library',
    password: 'admin123'
  },
  {
    id: '5',
    name: 'Bibliothécaire Sophie',
    email: 'sophie.lib@uds.cm',
    role: 'teacher',
    type: 'library',
    password: 'lib123'
  },
  {
    id: '6',
    name: 'Étudiant Dupont',
    email: 'etudiant@example.com',
    role: 'student',
    type: 'education',
    password: 'student123'
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

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
    try {
      const user = defaultUsers.find(u => u.email === email && u.password === password && u.type === type);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirection selon le rôle et le type
      if (type === 'education') {
        switch (user.role) {
          case 'admin':
            navigate('/education/admin');
            break;
          case 'teacher':
            navigate('/education/teacher');
            break;
          case 'student':
            navigate('/education/student');
            break;
        }
      } else {
        navigate('/library/admin');
      }
    } catch (error) {
      throw error;
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
      type,
      password
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