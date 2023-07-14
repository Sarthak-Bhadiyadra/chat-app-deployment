"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessages = exports.updateGroupChats = exports.createGroupChats = exports.getChatOfAllUser = exports.getAllConversation = exports.checkAccessOrCreate = exports.listAllUserChat = exports.listAllUsers = exports.createUsers = void 0;
const User_1 = require("../Models/User");
const Chat_1 = require("../Models/Chat");
const Message_1 = require("../Models/Message");
const ChatUser_1 = require("../Models/ChatUser");
// Handler for the "/users" route
const createUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    //@ts-ignore
    data === null || data === void 0 ? true : delete data.confirmPassword;
    try {
        const checkuser = yield (0, User_1.checkUserExist)(data);
        if (checkuser) {
            res.send("User Already Exists..!");
        }
        else {
            const user = yield (0, User_1.createUser)(data);
            res.json({
                status: 200,
                data: user,
            });
        }
    }
    catch (error) {
        console.log("error", error);
        res.send("Error in creating User");
    }
});
exports.createUsers = createUsers;
const listAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let search = req.query.search;
        //@ts-ignore
        const user = yield (0, User_1.listAllUser)(search, req.user_id);
        res.json({
            status: 200,
            data: user,
        });
    }
    catch (error) {
        console.log("error", error);
        res.send("Something Went Wrong...!");
    }
});
exports.listAllUsers = listAllUsers;
const listAllUserChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const data = await isChatAvailable(,req.params.user_id);
        res.json({
            status: 200,
            // data: data,
        });
    }
    catch (error) {
        console.log("error: ", error);
    }
});
exports.listAllUserChat = listAllUserChat;
const checkAccessOrCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = {
            chat: {},
        };
        //@ts-ignore
        const data = yield (0, Chat_1.isChatAvailable)(req.params.user_id);
        if (!data) {
            let user = yield (0, User_1.userDetails)({ id: req.params.user_id });
            //@ts-ignore
            const data = yield (0, Chat_1.createChat)(req.user_id, req.params.user_id, {
                chat_name: `${user === null || user === void 0 ? void 0 : user.name}`,
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
        }
        else {
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
    }
    catch (error) {
        console.log("error: ", error);
    }
});
exports.checkAccessOrCreate = checkAccessOrCreate;
const getChatOfAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        let listOfChat = yield (0, Chat_1.listOfAllChat)(req.user_id);
        res.json({
            status: 200,
            data: listOfChat,
        });
    }
    catch (error) {
        console.log("error: ", error);
    }
});
exports.getChatOfAllUser = getChatOfAllUser;
const createGroupChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        let listOfChat = yield (0, Chat_1.createGroupChat)(req.user_id, req.body);
        res.json({
            status: 200,
            data: listOfChat,
        });
    }
    catch (error) {
        console.log("error: ", error);
    }
});
exports.createGroupChats = createGroupChats;
const updateGroupChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // console.log("asd");
        //@ts-ignore
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.users) {
            const chatDetails = yield (0, Chat_1.getChatDetails)(req.params.id);
            let oldUserArray = chatDetails === null || chatDetails === void 0 ? void 0 : chatDetails.Chatusers.map((e) => e.user_id);
            let inputArray = req.body.users;
            // let listOfChat = await createGroupChat(req.user_id, req.body);
            const newAddedUserArray = inputArray.filter(
            //@ts-ignore
            (user) => !(oldUserArray === null || oldUserArray === void 0 ? void 0 : oldUserArray.includes(user)));
            const removeUserArray = oldUserArray === null || oldUserArray === void 0 ? void 0 : oldUserArray.filter((user) => !inputArray.includes(user));
            if (chatDetails && newAddedUserArray && newAddedUserArray.length > 0) {
                //@ts-ignore
                const prepareData = newAddedUserArray.map((e) => {
                    return {
                        user_id: e,
                        chat_id: chatDetails === null || chatDetails === void 0 ? void 0 : chatDetails.id,
                    };
                });
                const createUsers = yield (0, ChatUser_1.createManyChatUser)(prepareData);
            }
            if (chatDetails && removeUserArray && removeUserArray.length > 0) {
                const deleteUsers = yield (0, ChatUser_1.deleteManyChatUser)(chatDetails.id, removeUserArray);
            }
        }
        if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.name) {
            const changeChatNames = yield (0, Chat_1.changeChatName)(req.params.id, req.body.name);
            const chatDetails = yield (0, Chat_1.getChatDetails)(req.params.id);
            res.json({
                status: 200,
                data: chatDetails,
            });
        }
        const chatDetails = yield (0, Chat_1.getChatDetails)(req.params.id);
        res.json({
            status: 200,
            data: chatDetails,
        });
    }
    catch (error) {
        console.log("error: ", error);
    }
});
exports.updateGroupChats = updateGroupChats;
const createMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {
        //@ts-ignore
        sender_id: req.user_id,
        content: req.body.content,
        chat_id: req.params.chat_id,
        //@ts-ignore
        read_by: [req.user_id],
    };
    //@ts-ignore
    let message = yield (0, Message_1.createMessage)(data);
    let changeLatestMessages = yield (0, Chat_1.changeChatLatestMessage)(req.params.chat_id, req.body.content);
    let conversations = yield (0, Message_1.conversation)(req.params.id, true);
    res.json({
        status: 200,
        data: conversations,
    });
});
exports.createMessages = createMessages;
const getAllConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conversations = yield (0, Message_1.conversation)(req.params.id);
        res.json({
            status: 200,
            data: conversations,
        });
    }
    catch (error) {
        console.log("error: ", error);
    }
});
exports.getAllConversation = getAllConversation;
