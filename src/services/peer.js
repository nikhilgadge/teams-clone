class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  createOffer = async () => {
    // create offer
    if (this.peer) return null;

    const offer = await this.peer.createOffer();

    // set this offer to our local discription
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));

    return offer;
  };

  createAnswer = async (offer) => {
    if (!this.peer) return null;
    // set offer coming from other user as our remote descriptio
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));

    // create answer
    const answer = await this.peer.createAnswer();

    // set this answer as our local description
    await this.peer.setLocalDescription(new RTCSessionDescription(answer));

    return answer;
  };

  setRemoteAnswer = async (answer) => {
    if (!this.peer) return;

    await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
  };
}

export default PeerService;
