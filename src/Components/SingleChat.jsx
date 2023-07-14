import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import animationData from "../Animation/Typing.json";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./Miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./Miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import "./Style.css";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";

const END_POINT = "https://personal-chat-app-jeyn.onrender.com";
var socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop-typing", selectedChat.id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          `https://personal-chat-app-jeyn.onrender.com/users/${user.id}/chat/${selectedChat.id}/message`,
          {
            content: newMessage,
          },
          config
        );
        // socket.emit("new-message", (newMessageRecieved) => {
        //   console.log('newMessageRecieved: ', newMessageRecieved);
        //   if (
        //     !selectedChatCompare ||
        //     selectedChatCompare.id === newMessageRecieved.chat.id
        //   ) {
        //     //Notification Logic
        //   } else {
        //     setMessages([...messages, newMessageRecieved]);
        //   }
        // });
        socket.emit("new-message", data?.data);
        setMessages([...messages, data?.data]);
      } catch (error) {
        toast({
          title: "error occured",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat.id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && !typing) {
        socket.emit("stop-typing", selectedChat.id);
        setTyping(false);
      }
    }, timerLength);
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `https://personal-chat-app-jeyn.onrender.com/users/${user.id}/chat/${selectedChat.id}`,
        config
      );
      setLoading(false);
      setMessages(data?.data);
      socket.emit("join-chat", selectedChat);
    } catch (error) {
      toast({
        title: "error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message-received", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare?.id !== newMessageRecieved.chat_id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.is_group_chat ? (
              <>
                {getSender(user, selectedChat.Chatusers)}{" "}
                <ProfileModel
                  user={getSenderFull(user, selectedChat?.Chatusers)}
                />
              </>
            ) : (
              <>
                {selectedChat.chat_name.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center0"}
                margin={"auto"}
              ></Spinner>
            ) : (
              <div className="messages">
                <ScrollableChats messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? (
                <Lottie
                  options={defaultOptions}
                  height={35}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                ></Lottie>
              ) : (
                <></>
              )}
              {/* {typing ? <div>Loading....</div> : <div> Not Loading</div>} */}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
                autoComplete="off"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}
