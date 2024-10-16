import { apiService } from '@/services/ApiServices';
import { deleteData, getData, storeData } from '@/utils/secureStore';
import React, { useContext, useEffect, useState } from 'react';

const SESSION_KEY = 'session';

interface ISessionContext {
  session: string;
  signUp: (phone: string, password: string, name: string) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface IJwt {
  jwt: string;
}

const SessionContext = React.createContext<ISessionContext | null>(null);

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState('');

  useEffect(() => {
    (async () => {
      let token = await getData<string>('session');
      setSession(token!);
    })();
  });

  const signUp = async (phone: string, password: string, name: string) => {
    if (!!phone && !!password && !!name) {
      const url = `auth/signup`;
      const response = await apiService.request<IJwt>(url, 'POST', {
        phone,
        name,
        password,
      });
      setSession(response?.data?.jwt);
      storeData<string>(SESSION_KEY, response?.data?.jwt);
    }
  };

  const signIn = async (phone: string, password: string) => {
    if (!!phone && !!password) {
      const url = `auth/login`;
      const response = await apiService.request<IJwt>(url, 'POST', {
        phone,
        password,
      });
      setSession(response?.data?.jwt);
      storeData<string>(SESSION_KEY, response?.data?.jwt);
    }
  };

  const signOut = async () => {
    await deleteData(SESSION_KEY);
    setSession('');
  };

  return (
    <SessionContext.Provider value={{ session, signIn, signUp, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
