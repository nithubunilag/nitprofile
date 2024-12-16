import { Server, Socket } from "socket.io"
import { Server as HttpServer } from "http"
import { UnAuthorizedError, allowedOrigins, logger } from "@/core"

const WEBSOCKET_CORS = {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
}

export class Websocket extends Server {
    private static io: Websocket

    constructor(httpServer: HttpServer) {
        super(httpServer, {
            cors: WEBSOCKET_CORS,
        })
    }

    public static getInstance(httpServer?: HttpServer): Websocket {
        if (!Websocket.io && httpServer) {
            Websocket.io = new Websocket(httpServer)

            logger.info("Websocket Instance created successfully")
        }

        return Websocket.io
    }

    public initializeHandlers(socketHandlers: Array<any>) {
        socketHandlers.forEach((element) => {
            let namespace = Websocket.io.of(`/${element.path}`, (socket: Socket) => {
                element.handler.handleConnection(socket)
            })

            if (element.handler.middlewareImplementation) {
                namespace.use(element.handler.middlewareImplementation)
            }
        })
    }
}

export class WebsocketSecurityContext {
    public verifySocketToken = (socket: Socket, callback: (socket: Socket) => void) => {
        let token = socket.request

        if (token === null || typeof token === "undefined") {
            return new UnAuthorizedError("Unauthorized (token not valid)")
        }
    }
}
