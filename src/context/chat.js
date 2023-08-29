import { createContext, useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";

export const ChatContext = createContext();

export const ChatProvider = (props) => {
  const [conversations, setConversations] = useState([]);
  const [membersStatus, setMembersStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(undefined);
  const { auth, isSocketConnected } = useAuth();
  useEffect(() => {
    if (auth?.user?.email && isSocketConnected) getConversation();
  }, [auth, isSocketConnected]);
  const getConversation = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get("/chat/getConversations", {
        withCredentials: true,
      });

      setConversations(response.data?.conversations);
      setMembersStatus(response.data?.memberStatus);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        membersStatus,
        setMembersStatus,
        isDataLoading: isLoading,
        setSelectedConversation,
        selectedConversation,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
