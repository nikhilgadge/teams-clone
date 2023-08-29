import { useContext } from "react";
import { PeerContext } from "../context/peer";

const usePeer = () => useContext(PeerContext);

export default usePeer;
