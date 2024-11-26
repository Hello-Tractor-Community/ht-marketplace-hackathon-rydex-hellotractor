import { FC, useContext, useEffect, useState } from "react";
import { Chat, getChats } from "../../api/chats/getChats";
import { AuthContext } from "../../context/AuthContext";
import { SocketProvider } from "../../context/SocketContext";
import { Box, Container, Stack, Typography } from "@mui/material";
import ChatListCard from "../../components/Chat/chatListCard";
import ChatCard from "../../components/Chat/chatCard";
import { useSearchParams } from "react-router-dom";

const BuyerChatPage: FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [params] = useSearchParams();

  const { authData } = useContext(AuthContext);

  useEffect(() => {
    getChats().then(setChats).catch(console.error);
  }, []);

  useEffect(() => {
    const chatId = params.get("chatId");
    if (chatId) {
      setSelectedChat(chats.find((chat) => chat.id === parseInt(chatId)));
    }
  }, [params, chats]);

  return (
    <SocketProvider>
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          p: 4,
        }}
      >
        <Stack
          direction={"row"}
          spacing={6}
          sx={{
            height: "80vh",
          }}
        >
          <ChatListCard
            chats={chats}
            setSelectedChat={(chat) => {
              setSelectedChat(chat);

              if (chat) {
                setChats((prevChats) => {
                  return prevChats.map((c) => {
                    if (c.id === chat.id) {
                      const myChatUser = chat.chatUsers?.find(
                        (chatUser) => chatUser.userId === authData?.user?.id
                      );
                      if (myChatUser?.messagesRead !== undefined) {
                        const chatCopy: Chat = JSON.parse(JSON.stringify(chat));
                        const myChatUserCopy = chatCopy.chatUsers?.find(
                          (chatUser) => chatUser.userId === authData?.user?.id
                        );
                        if (myChatUserCopy)
                          myChatUserCopy.messagesRead = chat.totalMessages;
                        return chatCopy;
                      }
                    }
                    return c;
                  });
                });
              } else {
                console.log("chat not found");
              }
            }}
            setChats={setChats}
            selectedChat={selectedChat}
          />
          {selectedChat ? (
            <ChatCard
              selectedChat={selectedChat}
              //   defaultMessage={
              //     product
              //       ? `Hello, I am interested in ${product.name}`
              //       : undefined
              //   }
            />
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>Select a chat to view</Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </SocketProvider>
  );
};

export default BuyerChatPage;
