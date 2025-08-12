type Broadcaster = (campaignId: string, message: any) => void

class WSHub {
  private broadcaster: Broadcaster | null = null

  setBroadcaster(fn: Broadcaster) {
    this.broadcaster = fn
  }

  broadcast(campaignId: string, message: any) {
    if (!this.broadcaster) return
    this.broadcaster(campaignId, message)
  }
}

export const wsHub = new WSHub()


