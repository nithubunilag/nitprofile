import { createServer } from "http"
import { NotificationSocket, Websocket, WEBSOCKET_CONSTANT } from "@/web-socket"
import { dispatch, app } from "@/app"
import { config } from "@/core"

export const startApp = async () => {
    const server = createServer(app)

    const io = Websocket.getInstance(server)

    io.initializeHandlers([{ path: WEBSOCKET_CONSTANT.NOTIFICATION.NAMESPACE, handler: new NotificationSocket() }])

    server.listen(config.port, () => dispatch("app:up"))
}
