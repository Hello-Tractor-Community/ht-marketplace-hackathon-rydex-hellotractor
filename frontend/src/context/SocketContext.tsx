import { createContext, FC, ReactNode, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export type CallbackParams<T extends object> = {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: T;
  message?: string;
};
type Props = { children: ReactNode | ReactNode[] };
export const SocketProvider: FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected: " + newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
