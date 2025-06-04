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
  sendPasswordResetEmail: (email: string) => Promise<void>; // Added
  verifyOtp: (email: string, otp: string) => Promise<string>; // Added - returns a token
  resetPassword: (token: string, newPassword: string) => Promise<void>; // Updated signature
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
        navigate('/library/home');
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

  const sendPasswordResetEmail = async (email: string) => {
    // Simulate sending a password reset email
    console.log(`Password reset email requested for: ${email}`);
    // In a real app, you would call your backend API here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    // You might want to store a temporary token or flag that an email has been sent
  };

  const verifyOtp = async (email: string, otp: string) => {
    // Simulate OTP verification
    console.log(`OTP verification for email: ${email} with OTP: ${otp}`);
    // In a real app, call your backend API to verify the OTP
    // If successful, the backend should return a secure, short-lived token
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    if (otp === "123456") { // Dummy OTP for simulation
      return "simulated-secure-token-from-backend";
    }
    throw new Error("Invalid OTP");
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // Simulate resetting the password using the token
    console.log(`Resetting password with token: ${token} and new password: ${newPassword}`);
    // In a real app, call your backend API to reset the password
    // The backend should validate the token before changing the password
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    // For now, just navigate to login
    // You might want to clear the current user or token from state/localStorage
    navigate('/login/education');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    sendPasswordResetEmail, // Added
    verifyOtp, // Added
    resetPassword // Updated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}