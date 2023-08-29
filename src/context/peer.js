import { createContext, useEffect, useMemo, useState } from "react";

export const PeerContext = createContext();

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );
  const handleTrackEvent = (event) => {
    const streams = event.streams;
    setRemoteStream(streams[0]);
  };

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer]);

  const createOffer = async () => {
    // create offer
    const offer = await peer.createOffer();

    // set this offer to our local discription
    await peer.setLocalDescription(offer);

    return offer;
  };

  const createAnswer = async (offer) => {
    // set offer coming from other user as our remote descriptio
    await peer.setRemoteDescription(offer);

    // create answer
    const answer = await peer.createAnswer();

    // set this answer as our local description
    await peer.setLocalDescription(answer);

    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    await peer.setRemoteDescription(answer);
  };

  const sendStream = (stream) => {
    // send this stream to connected peer

    const tracks = stream?.getTracks();
    if (tracks) {
      for (const track of tracks) {
        peer.addTrack(track);
      }
    }
  };
  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        sendStream,
        remoteStream,
        setRemoteEmailId,
        remoteEmailId,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
