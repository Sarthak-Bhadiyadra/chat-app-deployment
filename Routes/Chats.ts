import express, { Request, Response } from "express";
import { body } from "express-validator";
import { API_ENDPOINTS } from "../Types/Server";
import {
  checkAccessOrCreate,
  createGroupChats,
  createMessages,
  getAllConversation,
  getChatOfAllUser,
  listAllUserChat,
  updateGroupChats,
} from "../Controllers/User";
import { is_authorize_user, permitAccess } from "../Middleware/auth";
import { ROLE_SHORT_CODE } from "../Types/Users/type";
import { validateRequest } from "../Middleware/validation";
import { login } from "../Controllers/Login";
const chats = require("../data/data");

const router = express.Router({ mergeParams: true });

// router.get(
//   API_ENDPOINTS.LIST_ALL_USERS_CHAT,
//   is_authorize_user,
//   permitAccess(["self"]),
//   listAllUserChat
// );
router.get(
  API_ENDPOINTS.CHECK_ACCESS_OR_CREATE,
  is_authorize_user,
  permitAccess(["self"]),
  checkAccessOrCreate
);
router.get(
  API_ENDPOINTS.GET_ALL_CONVERSATION,
  is_authorize_user,
  permitAccess(["self"]),
  getAllConversation
);
router.get(
  API_ENDPOINTS.GET_LIST_OF_CHATS,
  is_authorize_user,
  permitAccess(["self"]),
  getChatOfAllUser
);
router.post(
  API_ENDPOINTS.CREATE_GROUP_CHAT,
  is_authorize_user,
  permitAccess(["self"]),
  createGroupChats
);
router.put(
  API_ENDPOINTS.UPDATE_GROUP_CHAT,
  is_authorize_user,
  permitAccess(["self"]),
  updateGroupChats
);

router.post(
  API_ENDPOINTS.CREATE_MESSAGE,
  is_authorize_user,
  permitAccess(["self"]),
  createMessages
);

export { router };
