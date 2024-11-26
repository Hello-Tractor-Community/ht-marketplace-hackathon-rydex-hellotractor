import { Server, Socket } from "socket.io";
import joinChat from "./joinChat";
import chatMessage from "./chatMessage";
import chatRead from "./chatRead";

export type CallbackParams = {
  success: boolean;
  data: any;
  message?: string;
};

export type Callback = ((params: CallbackParams) => void) | undefined;

const handlers = (io: Server, socket: Socket) => {
  console.log("Socket connected: " + socket.id);

  socket.join(socket.data.id.toString());

  socket.on("chat:join", joinChat(io, socket));
  socket.on("chat:message", chatMessage(io, socket));
  socket.on("chat:read", chatRead(io, socket));

  socket.on("disconnect", () => {
    console.log("Socket disconnected: " + socket.id);
  });
};

export default handlers;
