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
exports.createMessage = exports.conversation = void 0;
const db_client_1 = require("../Utils/Database/db.client");
const getPrismaInstance = () => db_client_1.nsql_db.message;
function conversation(chat_id, latest) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (latest) {
                const data = yield getPrismaInstance().findFirst({
                    where: {
                        chat_id: chat_id,
                    },
                    select: {
                        id: true,
                        chat_id: true,
                        sender_id: true,
                        content: true,
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                profile_image: true,
                                email: true,
                            },
                        },
                        chat: {
                            select: {
                                Chatusers: {
                                    select: {
                                        id: true,
                                        chat_id: true,
                                        user_id: true,
                                        user: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                                chat_name: true,
                                created_by: true,
                                id: true,
                                is_group_chat: true,
                                latest_message: true,
                            },
                        },
                    },
                    take: 1,
                    orderBy: {
                        id: "desc",
                    },
                });
                return data;
            }
            const data = yield getPrismaInstance().findMany({
                where: {
                    chat_id: chat_id,
                },
                select: {
                    id: true,
                    chat_id: true,
                    sender_id: true,
                    content: true,
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            profile_image: true,
                            email: true,
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
exports.conversation = conversation;
function createMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createMessage = yield getPrismaInstance().create({
                data,
                select: {
                    id: true,
                    chat_id: true,
                    content: true,
                    read_by: true,
                },
            });
            return createMessage;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createMessage = createMessage;
