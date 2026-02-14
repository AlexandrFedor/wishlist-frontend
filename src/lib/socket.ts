import { io, type Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;

  connect(token?: string): Socket {
    if (this.socket?.connected) return this.socket;

    this.socket = io(
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000",
      {
        auth: token ? { token } : undefined,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketManager = new SocketManager();
