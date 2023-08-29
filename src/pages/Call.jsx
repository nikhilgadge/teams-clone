import React, { useCallback, useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import usePeer from "../hooks/usePeer";
import ReactPlayer from "react-player";
import uuid from "react-uuid";

export default function Call() {
  const { socket } = useSocket();

  const {
    setRemoteAnswer,
    sendStream,
    remoteStream,
    peer,
    remoteEmailId,
    createOffer,
  } = usePeer();

  const [myStream, setMyStream] = useState();

  const handleNegociationNeeded = useCallback(async () => {
    console.log("Negociation needed");
    socket.emit(
      "initiate-call",
      {
        roomId: uuid(),
        emailId: remoteEmailId,
        offer: await createOffer(),
      },
      () => {
        // call initiated
      }
    );
  }, [createOffer, remoteEmailId, socket]);
  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegociationNeeded);

    return () => {
      peer.removeEventListener("negotiationneeded", handleNegociationNeeded);
    };
  }, [handleNegociationNeeded, peer]);
  useEffect(() => {
    socket.on("call-accepted", async (data) => {
      const { answer } = data;

      console.log("answer", answer);

      //   set this answer to our remote description
      await setRemoteAnswer(answer);

      console.log("Call accepted");
    });
  }, [socket, setRemoteAnswer, sendStream, myStream]);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // send myStream
    sendStream(myStream);
    setMyStream(stream);
  }, [myStream, sendStream]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div>
      {`Connected to ${remoteEmailId}`}
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
}
