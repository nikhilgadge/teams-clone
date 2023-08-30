import { createContext, useState } from "react";
import PeerService from "../services/peer";
export const PeerContext = createContext();

export const PeerProvider = (props) => {
  const [remoteEmailId, setRemoteEmailId] = useState(null);
  const PeerInstance = new PeerService();

  return (
    <PeerContext.Provider
      value={{
        setRemoteEmailId,
        remoteEmailId,
        peer: PeerInstance.peer,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
