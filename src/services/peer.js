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

  async createAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(ans);
      return ans;
    }
  }

  async setRemoteAnswer(ans) {
    try {
      if (this.peer) {
        await this.peer.setRemoteDescription(ans);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }

  async handleCandidate(candidate) {
    debugger;

    if (this.peer && !candidate) {
      await this.peer.addIceCandidate(null);
    }

    if (this.peer && candidate) {
      await this.peer.addIceCandidate(candidate);
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PeerService();
