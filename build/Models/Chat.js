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
exports.changeChatLatestMessage = exports.getChatDetails = exports.changeChatName = exports.createGroupChat = exports.listOfAllChat = exports.createChat = exports.isChatAvailable = void 0;
const db_client_1 = require("../Utils/Database/db.client");
const getPrismaInstance = () => db_client_1.nsql_db.chat;
function isChatAvailable(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getPrismaInstance().findFirst({
                where: {
                    is_group_chat: false,
                    Chatusers: {
                        some: {
                            user_id,
                        },
                    },
                },
                select: {
                    id: true,
                    chat_name: true,
                    is_group_chat: true,
                    latest_message: true,
                    created_by: true,
                    createdAt: true,
                    updatedAt: true,
                    Chatusers: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.isChatAvailable = isChatAvailable;
//@ts-ignore
function createChat(created_by, user_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createChat = yield getPrismaInstance().create({
                data: {
                    is_group_chat: data.is_group_chat,
                    chat_name: data.chat_name,
                    latest_message: data.latest_message,
                    created_by,
                    Chatusers: {
                        createMany: {
                            data: [
                                {
                                    user_id,
                                },
                                {
                                    user_id: created_by,
                                },
                            ],
                        },
                    },
                },
                select: {
                    id: true,
                    chat_name: true,
                    is_group_chat: true,
                    latest_message: true,
                    created_by: true,
                    createdAt: true,
                    updatedAt: true,
                    Chatusers: {
                        select: {
                            user: true,
                        },
                    },
                },
            });
            return createChat;
        }
        catch (error) { }
    });
}
exports.createChat = createChat;
function listOfAllChat(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getPrismaInstance().findMany({
                where: {
                    Chatusers: {
                        some: {
                            user_id,
                        },
                    },
                },
                select: {
                    id: true,
                    chat_name: true,
                    is_group_chat: true,
                    latest_message: true,
                    created_by: true,
                    Chatusers: {
                        select: {
                            user: true,
                        },
                    },
                },
            });
        }
        catch (error) { }
    });
}
exports.listOfAllChat = listOfAllChat;
function createGroupChat(created_by, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prepareData = data.users.map((e) => {
                return {
                    user_id: e,
                };
            });
            const createGroupChat = yield getPrismaInstance().create({
                data: {
                    chat_name: data.name,
                    is_group_chat: true,
                    latest_message: "",
                    created_by,
                    Chatusers: {
                        createMany: {
                            data: prepareData,
                        },
                    },
                },
                select: {
                    id: true,
                    chat_name: true,
                    is_group_chat: true,
                    latest_message: true,
                    created_by: true,
                    Chatusers: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return createGroupChat;
        }
        catch (error) {
            console.log("error: ", error);
            return error;
        }
    });
}
exports.createGroupChat = createGroupChat;
function getChatDetails(chat_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getPrismaInstance().findFirst({
                where: {
                    id: chat_id,
                },
                select: {
                    id: true,
                    chat_name: true,
                    is_group_chat: true,
                    latest_message: true,
                    created_by: true,
                    Chatusers: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        }
        catch (error) { }
    });
}
exports.getChatDetails = getChatDetails;
function changeChatName(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const changeChatName = yield getPrismaInstance().update({
                //@ts-ignore
                where: {
                    id,
                },
                //@ts-ignore
                data: {
                    //@ts-ignore
                    chat_name: data,
                },
            });
            return changeChatName;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.changeChatName = changeChatName;
function changeChatLatestMessage(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const changeChatName = yield getPrismaInstance().update({
                //@ts-ignore
                where: {
                    id,
                },
                //@ts-ignore
                data: {
                    //@ts-ignore
                    latest_message: data,
                },
            });
            return changeChatName;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.changeChatLatestMessage = changeChatLatestMessage;
