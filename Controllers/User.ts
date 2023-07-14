import { Request, Response } from "express";
import { createBodyRequest, updateBodyRequest } from "../Types/Users/type";
import {
  createUser,
  // listUser,
  listAllUser,
  // updateUser,
  // deleteUser,
  checkUserExist,
  userDetails,
} from "../Models/User";
import {
  changeChatLatestMessage,
  changeChatName,
  createChat,
  createGroupChat,
  getChatDetails,
  isChatAvailable,
  listOfAllChat,
} from "../Models/Chat";
import { conversation, createMessage } from "../Models/Message";
import { createManyChatUser, deleteManyChatUser } from "../Models/ChatUser";

// Handler for the "/users" route
const createUsers = async (req: createBodyRequest, res: Response) => {
  const data = req.body;
  //@ts-ignore
  delete data?.confirmPassword;
  try {
    const checkuser = await checkUserExist(data);
    if (checkuser) {
      res.send("User Already Exists..!");
    } else {
      const user = await createUser(data);
      res.json({
        status: 200,
        data: user,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.send("Error in creating User");
  }
};

const listAllUsers = async (req: Request, res: Response) => {
  try {
    let search = req.query.search;
    //@ts-ignore
    const user = await listAllUser(search as string, req.user_id);
    res.json({
      status: 200,
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    res.send("Something Went Wrong...!");
  }
};
const listAllUserChat = async (req: Request, res: Response) => {
  try {
    // const data = await isChatAvailable(,req.params.user_id);

    res.json({
      status: 200,
      // data: data,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
const checkAccessOrCreate = async (req: Request, res: Response) => {
  try {
    let response = {
      chat: {},
    };
    //@ts-ignore
    const data = await isChatAvailable(req.params.user_id);
    if (!data) {
      let user = await userDetails({ id: req.params.user_id });
      //@ts-ignore
      const data = await createChat(req.user_id, req.params.user_id, {
        chat_name: `${user?.name}`,
        is_group_chat: false,
        latest_message: "",
      });
      if (data) {
        response.chat = {
          id: data.id,
          chat_name: data.chat_name,
          is_group_chat: data.is_group_chat,
          latest_message: data.latest_message,
          created_by: data.created_by,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          Chatusers: data.Chatusers,
        };
      }
    } else {
      response.chat = {
        id: data.id,
        chat_name: data.chat_name,
        is_group_chat: data.is_group_chat,
        latest_message: data.latest_message,
        created_by: data.created_by,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        Chatusers: data.Chatusers,
      };
      // let conversations = await conversation(data.id);
    }

    res.json({
      status: 200,
      data: response,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
const getChatOfAllUser = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    let listOfChat = await listOfAllChat(req.user_id);
    res.json({
      status: 200,
      data: listOfChat,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
const createGroupChats = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    let listOfChat = await createGroupChat(req.user_id, req.body);
    res.json({
      status: 200,
      data: listOfChat,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
const updateGroupChats = async (req: Request, res: Response) => {
  try {
    // console.log("asd");
    //@ts-ignore
    if (req.body?.users) {
      const chatDetails = await getChatDetails(req.params.id);
      let oldUserArray = chatDetails?.Chatusers.map((e) => e.user_id);
      let inputArray = req.body.users;
      // let listOfChat = await createGroupChat(req.user_id, req.body);
      const newAddedUserArray = inputArray.filter(
        //@ts-ignore
        (user) => !oldUserArray?.includes(user)
      );
      const removeUserArray = oldUserArray?.filter(
        (user) => !inputArray.includes(user)
      );
      if (chatDetails && newAddedUserArray && newAddedUserArray.length > 0) {
        //@ts-ignore
        const prepareData = newAddedUserArray.map((e) => {
          return {
            user_id: e,
            chat_id: chatDetails?.id,
          };
        });
        const createUsers = await createManyChatUser(prepareData);
      }
      if (chatDetails && removeUserArray && removeUserArray.length > 0) {
        const deleteUsers = await deleteManyChatUser(
          chatDetails.id,
          removeUserArray
        );
      }
    }
    if (req.body?.name) {
      const changeChatNames = await changeChatName(
        req.params.id,
        req.body.name
      );
      const chatDetails = await getChatDetails(req.params.id);
      res.json({
        status: 200,
        data: chatDetails,
      });
    }
    const chatDetails = await getChatDetails(req.params.id);

    res.json({
      status: 200,
      data: chatDetails,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

const createMessages = async (req: Request, res: Response) => {
  let data = {
    //@ts-ignore
    sender_id: req.user_id,
    content: req.body.content,
    chat_id: req.params.chat_id,
    //@ts-ignore
    read_by: [req.user_id],
  };
  //@ts-ignore
  let message = await createMessage(data);
  let changeLatestMessages = await changeChatLatestMessage(
    req.params.chat_id,
    req.body.content
  );
  let conversations = await conversation(req.params.id, true);

  res.json({
    status: 200,
    data: conversations,
  });
};
const getAllConversation = async (req: Request, res: Response) => {
  try {
    let conversations = await conversation(req.params.id);
    res.json({
      status: 200,
      data: conversations,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

// const updateUsers = async (req: updateBodyRequest, res: Response) => {
//   const data = req.body;
//   const id = req.params.id;
//   try {
//     const user = await updateUser(data, id);
//     res.json({
//       status: 200,
//       data: user,
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.send("Something Went Wrong...!");
//   }
// };

// const deleteUsers = async (req: createBodyRequest, res: Response) => {
//   const id = req.params.id;
//   try {
//     const user = await deleteUser(id);
//     res.json({
//       status: 200,
//       data: user,
//       message: "User Deleted Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.send("Something Went Wrong...!");
//   }
// };
// const detailsUsers = async (req: createBodyRequest, res: Response) => {
//   const id = req.params.id;
//   try {
//     const user = await userDetails({ id });
//     res.json({
//       status: 200,
//       data: user,
//       message: "User Details Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.send("Something Went Wrong...!");
//   }
// };

export {
  createUsers,
  listAllUsers,
  listAllUserChat,
  checkAccessOrCreate,
  getAllConversation,
  getChatOfAllUser,
  createGroupChats,
  updateGroupChats,
  createMessages,
  //   updateUsers,
  //   deleteUsers,
  //    detailsUsers
};
