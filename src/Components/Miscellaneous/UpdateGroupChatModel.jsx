import { InputGroup, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvtar/UserBadgeItem";
import UserListItem from "../UserAvtar/UserListItem";
import axios from "axios";
export default function UpdateGroupChatModel({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { selectedChat, user, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chat_name);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const { data } = await axios.get(
        `https://personal-chat-app-jeyn.onrender.com/users?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data?.data);
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

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const { data } = await axios.put(
        `https://personal-chat-app-jeyn.onrender.com/users/${user.id}/chat/${selectedChat.id}`,
        {
          name: groupChatName,
        },
        config
      );
      if (data) {
        setSelectedChat(data?.data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
        toast({
          title: "Group Chat Name Updated Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setRenameLoading(false);
    }
    setGroupChatName(groupChatName);
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.created_by !== user.id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (selectedChat.Chatusers.find((u) => u.user.id === user1.id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const { data } = await axios.put(
        `https://personal-chat-app-jeyn.onrender.com/users/${user.id}/chat/${selectedChat.id}`,
        {
          users: [...selectedChat.Chatusers.map((e) => e.user.id), user1.id],
        },
        config
      );
      if (data) {
        setFetchAgain(!fetchAgain);
        setSelectedChat(data?.data);
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.created_by !== user.id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    let oldArray = selectedChat.Chatusers.map((e) => e.user.id);
    let newArray = oldArray.filter((element) => element !== user1.id);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const { data } = await axios.put(
        `https://personal-chat-app-jeyn.onrender.com/users/${user.id}/chat/${selectedChat.id}`,
        {
          users: newArray,
        },
        config
      );
      if (data) {
        user1.id === user.id ? setSelectedChat() : setSelectedChat(data?.data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chat_name}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.Chatusers.map((u, i) => (
                <UserBadgeItem
                  key={i}
                  user={u.user}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u.user)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <InputGroup>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameloading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
