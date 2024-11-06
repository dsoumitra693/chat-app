import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

interface SocketProviderProps {
  children: React.ReactNode;
}

interface ISocketContext {}

const SocketContext = React.createContext<ISocketContext | null>(null);

const SocketProviders: React.FC<SocketProviderProps> = ({ children }) => {

useEffect(() => {
}, [])


  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProviders;
