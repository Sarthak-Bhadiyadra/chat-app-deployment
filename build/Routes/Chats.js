"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Server_1 = require("../Types/Server");
const User_1 = require("../Controllers/User");
const auth_1 = require("../Middleware/auth");
const chats = require("../data/data");
const router = express_1.default.Router({ mergeParams: true });
exports.router = router;
// router.get(
//   API_ENDPOINTS.LIST_ALL_USERS_CHAT,
//   is_authorize_user,
//   permitAccess(["self"]),
//   listAllUserChat
// );
router.get(Server_1.API_ENDPOINTS.CHECK_ACCESS_OR_CREATE, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.checkAccessOrCreate);
router.get(Server_1.API_ENDPOINTS.GET_ALL_CONVERSATION, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.getAllConversation);
router.get(Server_1.API_ENDPOINTS.GET_LIST_OF_CHATS, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.getChatOfAllUser);
router.post(Server_1.API_ENDPOINTS.CREATE_GROUP_CHAT, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.createGroupChats);
router.put(Server_1.API_ENDPOINTS.UPDATE_GROUP_CHAT, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.updateGroupChats);
router.post(Server_1.API_ENDPOINTS.CREATE_MESSAGE, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.createMessages);
