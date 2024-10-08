import { apiService } from "@/services/ApiServices";
import React, { useContext, useEffect, useState } from "react";

interface ISessionContext {
  session: string;
  signUp: (phone: string, password: string, name: string) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("usePeopleContext must be used within a PeopleProvider");
  }
  return context;
};

interface IJwt {
  jwt: string;
}

const SessionContext = React.createContext<ISessionContext | null>(null);

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState("");

  const signUp = async (phone: string, password: string, name: string) => {
    if (!!phone && !!password && !!name) {
      const url = `auth/signup`;
      const response = await apiService.request<IJwt>(url, "POST", {
        phone,
        name,
        password,
      });
      setSession(response?.data?.jwt);
    }
  };

  const signIn = async (phone: string, password: string) => {
    if (!!phone && !!password) {
      const url = `auth/login`;
      const response = await apiService.request<IJwt>(url, "POST", {
        phone,
        password,
      });
      setSession(response?.data?.jwt);
    }
  };

  return (
    <SessionContext.Provider value={{ session, signIn, signUp }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
