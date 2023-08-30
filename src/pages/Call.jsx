import React, { useCallback, useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import usePeer from "../hooks/usePeer";
import ReactPlayer from "react-player";

export default function Call() {
  const { socket } = useSocket();

  const { remoteEmailId, peer } = usePeer();

  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleNegociationNeeded = useCallback(async () => {
    console.log("Negociation needed");

    const offer = await peer.createOffer();

    socket.emit("negotiationneeded", { offer, toEmail: remoteEmailId });
  }, [peer, socket, remoteEmailId]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegociationNeeded);

    return () => {
      peer.removeEventListener("negotiationneeded", handleNegociationNeeded);
    };
  }, [handleNegociationNeeded]);

  const sendTrackToConnectedPeer = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    async (data) => {
      const { answer } = data;

      console.log("answer", answer);

      //   set this answer to our remote description
      await peer.setRemoteAnswer(answer);

      // send your stream to other connected peer
      sendTrackToConnectedPeer();

      console.log("Call accepted");
    },
    [sendTrackToConnectedPeer]
  );

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
      socket.on("negotiation-accpeted", onNegotiationAccepted);
    };
  }, [
    handleCallAccepted,
    socket,
    onNegotiationIncomming,
    onNegotiationAccepted,
  ]);

  const trackListner = (event) => {
    const remoteStream = event.streams;
    setRemoteStream(remoteStream[0]);
  };

  useEffect(() => {
    // event listener if we get tracks from connected peer
    peer.addEventListener("track", trackListner);

    return () => {
      peer.removeEventListener("track", trackListner);
    };
  }, []);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    // // send myStream
    // sendStream(myStream);
    setMyStream(stream);
  }, []);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div>
      {`Connected to ${remoteEmailId}`}
      <p>My Stream</p>
      {myStream && <ReactPlayer url={myStream} playing muted />}
      <p>Remote Stream</p>
      {remoteStream && (
        <button onClick={sendTrackToConnectedPeer}>Send Stream</button>
      )}

      {remoteStream && <ReactPlayer url={remoteStream} playing />}
    </div>
  );
}
