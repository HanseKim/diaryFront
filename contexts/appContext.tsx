import React, { createContext, useState, ReactNode, SetStateAction } from "react";

type MessageProp = {
  id: string; user: string; text: string, date: string;
}

// Define the shape of the context
type AppContextType = {
  messages: MessageProp[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProp[]>>;
  groupid: string;
  setGroupId: React.Dispatch<React.SetStateAction<string>>;
};

// Create the Context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageProp[]>([]);
  const [groupid, setGroupId] = useState<string>("");
  return (
    <AppContext.Provider value={{ messages, setMessages, groupid, setGroupId }}>
      {children}
    </AppContext.Provider>
  );
};
