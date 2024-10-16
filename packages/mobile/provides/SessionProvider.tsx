import { authApiService, userApiService } from '@/services/ApiServices';
import { IUser } from '@/types';
import { deleteData, getData, storeData } from '@/utils/secureStore';
import React, { useContext, useEffect, useState } from 'react';

const SESSION_KEY = 'messenger-session';
const USER_KEY = 'messenger-user-data';

interface ISessionContext {
  session: ISession | undefined;
  user: IUser | undefined;
  signUp: (phone: string, password: string) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (
    fullname?: string,
    bio?: string,
    profilePicture?: string
  ) => Promise<void>;
  createUserProfile: (
    fullname: string,
    bio?: string,
    profilePicture?: string
  ) => Promise<void>;
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

interface ISession {
  token: string;
  account: { id: string };
}

interface IUserResponse {
  user: IUser;
}

const SessionContext = React.createContext<ISessionContext | null>(null);

/**
 * SessionProvider component that manages user session and authentication state.
 * @param {React.ReactNode} children - The child components that will have access to session data.
 * @returns {JSX.Element} The session provider with context values.
 */
const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<ISession | undefined>(undefined);
  const [user, setUser] = useState<IUser | undefined>(undefined);

  /**
   * Effect to load session data from secure store on component mount.
   * It restores any existing session from secure storage.
   */
  useEffect(() => {
    (async () => {
      const _session = await getData<ISession>(SESSION_KEY);
      if (_session) setSession(_session);
    })();
  }, []);

  /**
   * Registers a new user and stores the session data.
   * @param {string} phone - The user's phone number.
   * @param {string} password - The user's password.
   * @returns {Promise<void>}
   */
  const signUp = async (phone: string, password: string) => {
    if (phone && password) {
      const {
        data: { token, account },
      } = await authApiService.request<ISession>('auth/signup', 'POST', {
        phone,
        password,
      });
      setSession({ token, account });
      storeData<string>(SESSION_KEY, token);
    }
  };

  /**
   * Creates a new user profile for the authenticated user.
   * @param {string} fullname - The user's full name.
   * @param {string} [bio] - The user's bio (optional).
   * @param {string} [profilePicture] - The user's profile picture URL (optional).
   * @returns {Promise<void>}
   */
  const createUserProfile = async (
    fullname: string,
    bio?: string,
    profilePicture?: string
  ) => {
    const payload: Record<string, any> = {
      token: session?.token!,
      fullname,
    };

    if (bio) payload.bio = bio;
    if (profilePicture) payload.profilePicture = profilePicture;

    const {
      data: { user },
    } = await userApiService.request<IUserResponse>(
      `users/${session?.account.id}`,
      'POST',
      payload
    );
    setUser(user);
    storeData<IUser>(USER_KEY, user);
  };

  /**
   * Updates the user's profile data.
   * @param {string} [fullname] - The user's updated full name (optional).
   * @param {string} [bio] - The user's updated bio (optional).
   * @param {string} [profilePicture] - The user's updated profile picture URL (optional).
   * @returns {Promise<void>}
   */
  const updateUserProfile = async (
    fullname?: string,
    bio?: string,
    profilePicture?: string
  ) => {
    const payload: Record<string, any> = {
      token: session?.token!,
    };

    if (fullname) payload.fullname = fullname;
    if (bio) payload.bio = bio;
    if (profilePicture) payload.profilePicture = profilePicture;
    
    const {
      data: { user },
    } = await userApiService.request<IUserResponse>(
      `users/${session?.account.id}`,
      'POST',
      payload
    );
    setUser(user);
    storeData<IUser>(USER_KEY, user);
  };

  /**
   * Signs in the user and stores the session and user data.
   * @param {string} phone - The user's phone number.
   * @param {string} password - The user's password.
   * @returns {Promise<void>}
   */
  const signIn = async (phone: string, password: string) => {
    if (phone && password) {
      const { data } = await authApiService.request<ISession>(
        'auth/login',
        'POST',
        { phone, password }
      );
      setSession(data);
      storeData<ISession>(SESSION_KEY, data);

      const {
        data: { user },
      } = await userApiService.request<IUserResponse>(
        `users/${data.account.id}`,
        'GET',
        { token: data.token }
      );
      setUser(user);
      storeData<IUser>(USER_KEY, user);
    }
  };

  /**
   * Signs out the user by clearing session and user data from secure store.
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    await deleteData(SESSION_KEY);
    await deleteData(USER_KEY);
    setSession(undefined);
    setUser(undefined);
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        signOut,
        createUserProfile,
        updateUserProfile,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
