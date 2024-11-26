import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Collapse,
  Divider,
  Grow,
  Stack,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { Chat, Message } from "../../api/chats/getChats";
import { AuthContext } from "../../context/AuthContext";
import { User } from "lucide-react";
import { getChatPageDate } from "../../utils/getChatPageDate";
import { SocketContext } from "../../context/SocketContext";

type Props = {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  selectedChat?: Chat;
  setSelectedChat: (chat: Chat) => void;
};
const ChatListCard: FC<Props> = ({
  chats,
  setSelectedChat,
  selectedChat,
  setChats,
}) => {
  const { authData } = useContext(AuthContext);

  const socket = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.on("chat:message", (data: Message) => {
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === data?.chatId) {
              console.log("chat found", chat);
              const chatCopy: Chat = JSON.parse(JSON.stringify(chat));

              if (chat.id !== selectedChat?.id) {
                chatCopy.totalMessages += 1;
              }

              chatCopy.headMessage = data;
              chatCopy.head = data.id;
              chatCopy.updatedAt = data.createdAt;
              return chatCopy;
            }

            return chat;
          });
        });
      });

      socket.on("chat:created", (data: Chat) => {
        setChats((prevChats) => {
          return [...prevChats, data];
        });
      });
    }

    return () => {
      socket?.off("chat:message");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedChat]);

  return (
    <Card
      sx={{
        height: "100%",
        width: "300px",
      }}
    >
      <CardHeader title="Chats" />
      <Stack>
        {chats.map((chat, index) => {
          const myChatUser = chat.chatUsers?.find(
            (chatUser) => chatUser.userId === authData?.user?.id
          );
          const otherUser = chat.users?.find(
            (user) => user.id !== authData?.user?.id
          );
          const isRead = chat.totalMessages === myChatUser?.messagesRead;
          const isSelected = selectedChat?.id === chat.id;
          return (
            <Fragment key={chat.id}>
              <CardActionArea
                onClick={() => {
                  setSelectedChat(chat);
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center", py: 2, px: 4 }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        height: isSelected ? "30px" : "0px",
                        width: isSelected ? 2.5 : 0,
                        backgroundColor: "primary.main",
                        borderRadius: 5,
                        transition: "all 0.15s",
                        mr: isSelected ? 2 : 0,
                      }}
                    />
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      src={otherUser?.image}
                    >
                      {otherUser?.name?.charAt(0)?.toUpperCase() ?? <User />}
                    </Avatar>
                  </Stack>
                  <Stack
                    sx={{
                      flexGrow: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {otherUser?.name}
                    </Typography>
                    <Typography
                      sx={{
                        // fontWeight: 700,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                      variant="caption"
                    >
                      {chat.headMessage?.userId === authData?.user?.id
                        ? "You: "
                        : ""}
                      {chat.headMessage?.message}
                    </Typography>
                  </Stack>
                  <Collapse in>
                    <Stack
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color={!isRead ? "primary" : undefined}
                        fontWeight={!isRead ? 700 : undefined}
                      >
                        {getChatPageDate(chat.updatedAt)}
                      </Typography>

                      <Grow in={!isRead}>
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: 700,
                            }}
                            variant="caption"
                          >
                            {chat.totalMessages -
                              (myChatUser?.messagesRead ?? 0)}
                          </Typography>
                        </Box>
                      </Grow>
                    </Stack>
                  </Collapse>
                </Stack>
              </CardActionArea>
              {index !== chats.length - 1 && <Divider sx={{ m: 0, p: 0 }} />}
            </Fragment>
          );
        })}
      </Stack>
    </Card>
  );
};

export default ChatListCard;
