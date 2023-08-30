import React, { useCallback, useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import useAuth from "../hooks/useAuth";

export default function Call() {
  const { socket } = useSocket();

  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const { remoteEmailId } = useAuth();

  const handleNegociationNeeded = useCallback(async () => {
    console.log("Negociation needed");

    const offer = await peer.createOffer();

    socket.emit("negotiationneeded", { offer, toEmail: remoteEmailId });
  }, [socket, remoteEmailId]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegociationNeeded);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegociationNeeded
      );
    };
  }, [handleNegociationNeeded]);

  const sendTrackToConnectedPeer = useCallback((stream) => {
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  }, []);

  const handleCallAccepted = useCallback(async (data) => {
    const { answer } = data;

    console.log("answer", answer);

    //   set this answer to our remote description
    await peer.setRemoteAnswer(answer);

    // send your stream to other connected peer
    // sendTrackToConnectedPeer(myStream);

    console.log("Call accepted");
  }, []);

  const onNegotiationIncomming = useCallback(
    async ({ fromEmail, offer }) => {
      const answer = await peer.createAnswer(offer);

      socket.emit("negotiation-accpeted", { answer, toEmail: fromEmail });
    },
    [socket]
  );

  const onNegotiationAccepted = useCallback(async ({ answer, fromEmail }) => {
    await peer.setRemoteAnswer(answer);
  }, []);
  useEffect(() => {
    socket.on("call-accepted", handleCallAccepted);

    // if connected user sends negociation offer
    socket.on("negotiationneeded", onNegotiationIncomming);

    // negotiation-accpeted
    socket.on("negotiation-accpeted", onNegotiationAccepted);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("negotiationneeded", onNegotiationIncomming);
      socket.off("negotiation-accpeted", onNegotiationAccepted);
    };
  }, [
    handleCallAccepted,
    socket,
    onNegotiationIncomming,
    onNegotiationAccepted,
  ]);

  const trackListner = (event) => {
    console.log("Got track");

    const remoteStream = event.streams;

    setRemoteStream(remoteStream[0]);
  };

  useEffect(() => {
    // event listener if we get tracks from connected peer
    peer.peer.addEventListener("track", trackListner);
    // dw
    return () => {
      peer.peer.removeEventListener("track", trackListner);
    };
  }, []);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    // send your stream to other connected peer
    sendTrackToConnectedPeer(stream);

    setMyStream(stream);
  }, [sendTrackToConnectedPeer]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div>
      {`Connected to ${remoteEmailId}`}
      <p>My Stream</p>
      {myStream && (
        <ReactPlayer
          url={myStream}
          playing
          muted
          height="200px"
          width="200px"
        />
      )}
      <p>Remote Stream</p>

      {remoteStream && (
        <ReactPlayer url={remoteStream} playing height="200px" width="200px" />
      )}
    </div>
  );
}
