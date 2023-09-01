import { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";
import useChat from "../hooks/useChat";
import { useLocation, useNavigate } from "react-router-dom";
export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState();
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const { setConversations, setMembersStatus, setSelectedConversation } =
    useChat();
  const { auth, setIsSocketConnected, setRemoteEmailId, remoteEmailId } =
    useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const emit = (event, arg) => {
    socket.emit(event, arg, (err) => {
      if (err) {
        // no ack from the server, let's retry
        console.log(err);
        emit(event, arg);
      }
    });
  };

  useEffect(() => {
    if (auth?.accessToken) {
      try {
        const socket = io(`${process.env.REACT_APP_URL}`, {
          auth: {
            token: auth?.accessToken,
          },
        });

        if (socket) {
          socket.on("connect", () => {
            setIsSocketConnected(true);
          });
          socket.on("disconnect", () => {
            setIsSocketConnected(false);
          });

          socket.on("recieve", ({ data, isNewConversation, tempId }) => {
            console.log("recieve event triggered");
            setConversations((prevConversations) => {
              return prevConversations.map((c) => {
                if (isNewConversation && tempId && c._id === tempId) {
                  return { ...data };
                }

                if (c._id === data._id) {
                  return { ...data };
                }

                return c;
              });
            });

            isNewConversation && setSelectedConversation(data._id);
          });

          socket.on("status-change", (data) => {
            console.log("status change event");
            setMembersStatus((prevMembers) => {
              return prevMembers.map((m) => {
                if (m.email === data.email) {
                  return { ...data };
                }

                return m;
              });
            });
          });

          socket.on("incoming-call", ({ roomID, fromEmail }) => {
            debugger;
            const path = location.pathname;
            if (path.startsWith("/call/")) return;

            setRemoteEmailId(fromEmail);
            navigate(`call/${roomID}`);
          });
        }

        setSocket(socket);
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    auth,
    setConversations,
    setMembersStatus,
    setSelectedConversation,
    setIsSocketConnected,
    navigate,
    setRemoteEmailId,
    remoteEmailId,
    myStream,
    location.pathname,
  ]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        emit,
        myStream,
        setMyStream,
        remoteStream,
        setRemoteStream,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};
