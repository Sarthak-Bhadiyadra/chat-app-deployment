import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const pictureDetails = (pics) => {
    setLoading(true);
    if (pics === "undefined") {
      toast({
        title: "Error",
        description: "Please select a picture",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat_App");
      data.append("cloud_name", "sarthak1234");
      data.append("api_key", "252129179667447");
      axios
        .post("https://api.cloudinary.com/v1_1/sarthak1234/auto/upload", data)
        .then((response) => {
          setPic(response?.data?.secure_url);
          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Error",
        description: "Please select a picture",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(false);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const data = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        profile_image: pic,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data: user } = await axios.post(
        "https://personal-chat-app-jeyn.onrender.com/users",
        data,
        config
      );
      if (user) {
        toast({
          title: "registration successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name "
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email "
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Password "
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Re-enter your password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="picture" isRequired>
        <FormLabel>Upload image</FormLabel>
        <Input
          placeholder="Upload picture"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => pictureDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="purple"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}
