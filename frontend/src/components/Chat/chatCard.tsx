import {
  Avatar,
  Button,
  Card,
  Fade,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Check, CheckCheck, Clock, Send } from "lucide-react";
import { Chat, getChatMessages, Message } from "../../api/chats/getChats";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CallbackParams, SocketContext } from "../../context/SocketContext";
import dayjs from "dayjs";
import { toast } from "../../utils/toast";

type Props = {
  selectedChat: Chat;
  onMessageSent?: (message: Message) => void;
  defaultMessage?: string;
};

const ChatCard: FC<Props> = ({
  selectedChat,
  onMessageSent,
  defaultMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { authData } = useContext(AuthContext);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (defaultMessage) {
      setNewMessage(defaultMessage);
    }
  }, [defaultMessage]);

  useEffect(() => {
    if (socket) {
      socket.emit(
        "chat:join",
        { chatId: selectedChat.id },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: CallbackParams<any>) => {
          if (!data.success && data.message) {
            toast({
              message: data.message,
              severity: "error",
            });
          }
        }
      );

      //we assume this user has read all chats. show blueticks
      socket.on("chat:joined", (data: { chatId: number; userId: number }) => {
        console.log("chat joined", data);

        if (data.userId !== authData.user?.id) {
          setMessages((prev) =>
            prev.map((m) => {
              if (!m.readReceipts) {
                m.readReceipts = [];
              }
              if (!m.readReceipts.find((r) => r.userId === data.userId)) {
                m.readReceipts.push({
                  userId: data.userId,
                  chatMessageId: m.id,
                  createdAt: new Date().toISOString(),
                  id: Math.random(),
                  updatedAt: new Date().toISOString(),
                  chatMessage: m,
                });
              }

              return m;
            })
          );
        }
      });

      //we assume this user has read all chats. show blueticks
      socket.on("chat:message", (data: Message) => {
        console.log("chat message wow", data);
        if (data.chatId === selectedChat.id) {
          setMessages((prev) => [data, ...prev]);

          socket.emit("chat:read", {
            chatId: selectedChat.id,
            messageId: data.id,
          });
        }
      });

      socket.on(
        "chat:read",
        (data: { chatMessageId: number; userId: number }) => {
          console.log("chat read", data);

          setMessages((prev) =>
            prev.map((m) => {
              if (m.id === data.chatMessageId) {
                if (!m.readReceipts) {
                  m.readReceipts = [];
                }
                if (!m.readReceipts.find((r) => r.userId === data.userId)) {
                  m.readReceipts.push({
                    userId: data.userId,
                    chatMessageId: m.id,
                    createdAt: new Date().toISOString(),
                    id: Math.random(),
                    updatedAt: new Date().toISOString(),
                    // chatMessage: m,
                  });
                }
              }

              return m;
            })
          );
        }
      );
    }
    return () => {
      socket?.off("chat:joined");
      socket?.off("chat:message");
      socket?.off("chat:read");
    };
  }, [socket, selectedChat, authData]);

  useEffect(() => {
    getChatMessages(selectedChat.id, {
      sort: "-createdAt",
    })
      .then(setMessages)
      .catch(console.error);
  }, [selectedChat]);

  const handleSendMessage = () => {
    try {
      if (!socket?.connected)
        throw new Error("You are not connected to the server");

      const tempId = Math.random().toString(36).substring(7);

      socket.emit(
        "chat:message",
        { chatId: selectedChat.id, message: newMessage.trim(), tempId },
        (data: CallbackParams<Message & { tempId: string }>) => {
          console.log("chat message ack", data);
          if (!data.success && data.message)
            toast({
              message: data.message,
              severity: "error",
            });

          const message = data.data;

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.tempId === message?.tempId ? message : msg
            )
          );
        }
      );

      const message: Message = {
        id: Math.random() * -1,
        userId: authData.user?.id ?? Math.random(),
        message: newMessage,
        createdAt: new Date().toISOString(),
        chatId: selectedChat.id,
        updatedAt: new Date().toISOString(),
        tempId,
      };

      setMessages((prevMessages) => [message, ...prevMessages]);

      onMessageSent?.(message);

      setNewMessage("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        message: error.message,
        severity: "error",
      });
    }
  };

  const otherUser = useMemo(() => {
    return selectedChat.users?.find((user) => user.id !== authData.user?.id);
  }, [selectedChat, authData.user?.id]);
  return (
    <Fade in>
      <Card
        sx={{
          width: "calc(100% - 300px)",
          p: 4,
          height: "100%",
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack
            direction={"row"}
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Avatar src={otherUser?.image}>
              {otherUser?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant={"h6"}>{otherUser?.name}</Typography>
          </Stack>
          <Stack
            sx={{
              flexGrow: 1,
              overflowY: "auto",

              p: 4,
            }}
            direction={"column-reverse"}
            spacing={2}
          >
            {messages.map((message) => {
              const isSent = message.userId === authData.user?.id;
              return (
                <Fade in key={message.id}>
                  <Card
                    sx={{
                      alignSelf: isSent ? "flex-end" : "flex-start",
                      backgroundColor: isSent
                        ? "primary.main"
                        : "background.default",
                      color: isSent ? "background.default" : "text.primary",
                      maxWidth: "75%",
                      p: 2,
                      width: "fit-content",
                      flexShrink: 0,
                    }}
                  >
                    <Stack>
                      <Typography color="inherit">{message.message}</Typography>
                      <Stack
                        direction={"row"}
                        sx={{
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                        spacing={1}
                      >
                        <Typography variant={"caption"} color="inherit">
                          {dayjs(message.createdAt).format("HH:mm")} {}
                        </Typography>
                        {isSent && (
                          <>
                            {message.id < 0 ? (
                              <Clock size={"15px"} />
                            ) : message?.readReceipts?.find(
                                (r) => r.userId !== authData.user?.id
                              ) ? (
                              <CheckCheck size={"15px"} />
                            ) : (
                              <Check size={"15px"} />
                            )}
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Card>
                </Fade>
              );
            })}
          </Stack>
          <Stack
            direction={"row"}
            spacing={2}
            sx={{
              alignItems: "center",
              pt: 2,
            }}
            component={"form"}
            onSubmit={(e) => {
              e.preventDefault();
              if (newMessage.trim() === "") return;
              handleSendMessage();
            }}
          >
            <TextField
              sx={{ width: "100%" }}
              size="small"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              variant={"contained"}
              endIcon={<Send />}
              onClick={() => {
                if (newMessage.trim() === "") return;
                handleSendMessage();
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Fade>
  );
};

export default ChatCard;
