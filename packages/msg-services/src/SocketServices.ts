import { Socket } from 'socket.io';

export class SocketServices {
  private io: Socket;
  constructor(io: Socket) {
    this.io = io;
  }
}
