import { useContext } from "react";
import { SocketContext } from "../context/socket";

const useSocket = () => useContext(SocketContext);

export default useSocket;
