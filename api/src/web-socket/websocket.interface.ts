import { Socket } from "socket.io"

export interface MySocketInterface {
    handleConnection(socket: Socket): void
    middlewareImplementation?(soccket: Socket, next: any): void
}
