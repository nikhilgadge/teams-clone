import { useContext } from "react";
import { ChatContext } from "../context/chat";

const useChat = () => useContext(ChatContext);

export default useChat;
