class WSHub {
    constructor() {
        this.broadcaster = null;
    }
    setBroadcaster(fn) {
        this.broadcaster = fn;
    }
    broadcast(campaignId, message) {
        if (!this.broadcaster)
            return;
        this.broadcaster(campaignId, message);
    }
}
export const wsHub = new WSHub();
