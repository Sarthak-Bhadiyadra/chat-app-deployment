import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import NotificationBedge from "react-notification-badge";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvtar/UserListItem";

export default function SideDrawer() {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search || search.length === 0) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
      setSearchResult(data?.data);
      setLoading(false);
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
  const accessChat = async (user_id) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `https://personal-chat-app-jeyn.onrender.com/users/${user_id}/chat`,
        config
      );
      if (!chats.find((c) => c.id === data.id))
        setChats([data?.data?.chat, ...chats]);

      setSelectedChat(data?.data?.chat);

      setLoadingChat(false);
      onClose();
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

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users" hasArrow placement="bottom">
          <Button variant={"ghost"} onClick={onOpen}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Text display={{ base: "none", md: "flex" }}>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Personal-Chat-App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBedge
                count={notification.length}
                effect={[null, null, { top: "-5px" }, { top: "0px" }]}
              />
              <BellIcon fontSize={"2xl"} m={1}></BellIcon>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages."}
              {notification.map((e) => {
                return (
                  <MenuItem
                    key={e.id}
                    onClick={() => {
                      setSelectedChat(e.chat);
                      setNotification(notification.filter((n) => n !== e));
                    }}
                  >
                    {notification.is_group_chat
                      ? `New Message in ${e.chat_name}`
                      : `New Message From ${e?.sender?.name}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.profile_image}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
            <DrawerBody>
              <Box display={"flex"} pb={2}>
                <Input
                  placeholder="Search by name or email"
                  fontSize={"14px"}
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Search</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => {
                  return (
                    <UserListItem
                      key={user.id}
                      user={user}
                      handleFunction={() => accessChat(user.id)}
                    />
                  );
                })
              )}
              {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
