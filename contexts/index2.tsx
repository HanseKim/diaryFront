import React, { createContext, useState, ReactNode } from "react";

// GlobalContext 타입 정의
interface GlobalContextType {
  showLoginView: boolean;
  setShowLoginView: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserName: string;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string>>;
  currentUser: string;
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
  allUsers: string[];
  setAllUsers: React.Dispatch<React.SetStateAction<string[]>>;
  allChatRooms: JSON[];
  setAllChatRooms: React.Dispatch<React.SetStateAction<JSON[]>>;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentGroupName: string;
  setCurrentGroupName: React.Dispatch<React.SetStateAction<string>>;
  allChatMessages: string[];
  setAllChatMessages: React.Dispatch<React.SetStateAction<string[]>>;
  currentChatMessage: string;
  setCurrentChatMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Context 생성
export const GlobalContext = createContext<GlobalContextType | null>(null);

// GlobalState 컴포넌트 타입 정의
interface GlobalStateProps {
  children: ReactNode;
}

function GlobalState({ children }: GlobalStateProps) {
  const [showLoginView, setShowLoginView] = useState<boolean>(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [allChatRooms, setAllChatRooms] = useState<JSON[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentGroupName, setCurrentGroupName] = useState<string>("");
  const [allChatMessages, setAllChatMessages] = useState<string[]>([]);
  const [currentChatMessage, setCurrentChatMessage] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        showLoginView,
        setShowLoginView,
        currentUserName,
        setCurrentUserName,
        currentUser,
        setCurrentUser,
        allUsers,
        setAllUsers,
        allChatRooms,
        setAllChatRooms,
        modalVisible,
        setModalVisible,
        currentGroupName,
        setCurrentGroupName,
        allChatMessages,
        setAllChatMessages,
        currentChatMessage,
        setCurrentChatMessage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;
