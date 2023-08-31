import { createContext, useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";
import useChat from "../hooks/useChat";
import { useNavigate } from "react-router-dom";
import peer from "../services/peer";
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

  const emit = (event, arg) => {
    socket.emit(event, arg, (err) => {
      if (err) {
        // no ack from the server, let's retry
        console.log(err);
        emit(event, arg);
      }
    });
  };

  const handleNegociationNeeded = useCallback(async () => {
    console.log("Negociation needed");

    const offer = await peer.createOffer();

    socket?.emit("negotiationneeded", { offer, toEmail: remoteEmailId });
  }, [remoteEmailId, socket]);

  const handleOnTrack = useCallback((event) => {
    console.log("Got tracks");
    debugger;

    const remoteStream = event.streams[0];

    setRemoteStream(remoteStream);
  }, []);

  const handleIceCandidate = useCallback(
    async (event) => {
      socket?.emit("ice-candidate", {
        toEmail: remoteEmailId,
        candidate: event.candidate,
      });
    },
    [remoteEmailId, socket]
  );

  useEffect(() => {
    // event listener if we get tracks from connected peer
    console.log("useEffect addEventListener track");

    peer.peer.addEventListener("negotiationneeded", handleNegociationNeeded);

    peer.peer.addEventListener("track", handleOnTrack);

    peer.peer.addEventListener("icecandidate", handleIceCandidate);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegociationNeeded
      );
      peer.peer.removeEventListener("track", handleOnTrack);

      peer.peer.removeEventListener("icecandidate", handleIceCandidate);
    };
  }, [handleIceCandidate, handleNegociationNeeded, handleOnTrack]);

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

          // webrtc
          socket.on("incoming-call", async (data) => {
            const { offer, fromEmail, roomId } = data;

            // create answer
            // send answer i.e accept call
            console.log("offer", offer);

            socket.emit("accept-call", {
              answer: await peer.createAnswer(offer),
              roomId,
              toEmail: fromEmail,
            });

            console.log("Incoming call");
            setRemoteEmailId(fromEmail);

            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
            });

            setMyStream(stream);

            navigate("/call");
          });

          socket.on("call-accepted", async (data) => {
            debugger;

            const { answer, fromEmail } = data;

            console.log("answer", answer);

            //   set this answer to our remote description
            await peer.setRemoteAnswer(answer);

            // ready now

            socket.emit("ready", { toEmail: fromEmail });

            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
            });

            setMyStream(stream);
            stream
              ?.getTracks()
              .forEach((track) => peer.peer.addTrack(track, stream));

            console.log("Call accepted");
          });

          socket.on("negotiationneeded", async ({ fromEmail, offer }) => {
            console.log("onNegotiationIncomming");

            const answer = await peer.createAnswer(offer);

            socket.emit("negotiation-accpeted", { answer, toEmail: fromEmail });
          });

          // negotiation-accpeted
          socket.on("negotiation-accpeted", async ({ answer, fromEmail }) => {
            console.log("onNegotiationAccepted");

            await peer.setRemoteAnswer(answer);
          });

          socket.on("ready", async () => {
            debugger;
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true,
            });

            setMyStream(stream);
            stream
              ?.getTracks()
              .forEach((track) => peer.peer.addTrack(track, stream));
          });

          socket.on("ice-candidate", async (data) => {
            const { candidate } = data;

            await peer.handleCandidate(candidate);
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
