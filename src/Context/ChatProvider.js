import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const data = jwt(localStorage.getItem("token"));
      const user = JSON.parse(JSON.stringify(data));
      setUser(user);
      if (!user) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
