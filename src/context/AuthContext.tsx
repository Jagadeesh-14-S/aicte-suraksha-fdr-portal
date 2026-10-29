import React, { createContext, useContext, useState, useEffect } from 'react';
import { RegionalOffice, UserRole } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  institutionId?: string;
  region?: RegionalOffice;
  bankName?: string;
  avatar: string;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  BUREAU_ADMIN: {
    id: 'USR-BUREAU-01',
    name: 'Dr. Ramesh K. Verma',
    role: 'BUREAU_ADMIN',
    title: 'Adviser & Bureau Head, AICTE Regulation Bureau, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  REGIONAL_OFFICER: {
    id: 'USR-RO-SWRO',
    name: 'Dr. A. P. Shinde',
    role: 'REGIONAL_OFFICER',
    title: 'Regional Officer, AICTE Western Regional Office (WRO), Mumbai',
    region: 'WRO_MUMBAI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  INSTITUTION_USER: {
    id: 'USR-INST-001',
    name: 'Prof. S. R. Deshmukh',
    role: 'INSTITUTION_USER',
    title: 'Principal & Authorized Trustee, MIT & Research, Pune',
    institutionId: 'INST-001',
    region: 'WRO_MUMBAI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  BANK_OFFICER: {
    id: 'USR-BANK-SBI',
    name: 'R. K. Sharma, AGM',
    role: 'BANK_OFFICER',
    title: 'Chief Manager & Lien Officer, State Bank of India',
    bankName: 'State Bank of India',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
};

interface AuthContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('suraksha_user_role');
    if (saved && PRESET_USERS[saved as UserRole]) {
      return PRESET_USERS[saved as UserRole];
    }
    return PRESET_USERS.BUREAU_ADMIN;
  });

  const switchRole = (role: UserRole) => {
    setCurrentUser(PRESET_USERS[role]);
    localStorage.setItem('suraksha_user_role', role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
