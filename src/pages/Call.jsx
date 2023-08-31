import React from "react";
import useSocket from "../hooks/useSocket";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import useAuth from "../hooks/useAuth";

export default function Call() {
  // console.log(peer.peer);
  const { myStream, remoteStream } = useSocket();

  const { remoteEmailId } = useAuth();

  return (
    <div>
      {`Connected to ${remoteEmailId}`}
      <p>My Stream</p>
      {myStream && (
        <ReactPlayer
          url={myStream}
          playing
          muted
          height="100px"
          width="100px"
        />
      )}
      <p>Remote Stream</p>

      <button
        onClick={() => {
          myStream
            .getTracks()
            .forEach((track) => peer.peer.addTrack(track, myStream));
        }}
      >
        Send stream
      </button>

      {remoteStream && (
        <ReactPlayer url={remoteStream} playing height="100px" width="100px" />
      )}
    </div>
  );
}
