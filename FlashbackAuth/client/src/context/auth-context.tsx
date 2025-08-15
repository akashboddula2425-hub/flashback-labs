import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserSession } from '@shared/schema';

interface AuthContextType {
  session: UserSession | null;
  setSession: (session: UserSession | null) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  token: string;
  setToken: (token: string) => void;
  selfieBlob: Blob | null;
  setSelfieBlob: (blob: Blob | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [token, setToken] = useState('');
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);

  return (
    <AuthContext.Provider value={{
      session,
      setSession,
      phoneNumber,
      setPhoneNumber,
      token,
      setToken,
      selfieBlob,
      setSelfieBlob
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
