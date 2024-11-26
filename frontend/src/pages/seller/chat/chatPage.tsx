import { FC, useContext, useEffect, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { Box, Stack, Typography } from "@mui/material";
import { Chat, getChats } from "../../../api/chats/getChats";
import ChatListCard from "../../../components/Chat/chatListCard";
import ChatCard from "../../../components/Chat/chatCard";
import { SocketProvider } from "../../../context/SocketContext";
import { AuthContext } from "../../../context/AuthContext";

const ChatPage: FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat>();

  const { authData } = useContext(AuthContext);

  useEffect(() => {
    getChats().then(setChats).catch(console.error);
  }, []);

  return (
    <SocketProvider>
      <PageContainer title="Messages">
        <Stack
          direction={"row"}
          spacing={6}
          sx={{
            height: "100%",
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
                      // console.log("asdupajs");
                      const myChatUser = chat.chatUsers?.find(
                        (chatUser) => chatUser.userId === authData?.user?.id
                      );
                      if (myChatUser?.messagesRead !== undefined) {
                        //   console.log("aowiw");
                        const chatCopy: Chat = JSON.parse(JSON.stringify(chat));
                        const myChatUserCopy = chatCopy.chatUsers?.find(
                          (chatUser) => chatUser.userId === authData?.user?.id
                        );
                        if (myChatUserCopy)
                          myChatUserCopy.messagesRead = chat.totalMessages;
                        //   console.log(chatCopy);
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
            <ChatCard selectedChat={selectedChat} />
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
      </PageContainer>
    </SocketProvider>
  );
};

export default ChatPage;
