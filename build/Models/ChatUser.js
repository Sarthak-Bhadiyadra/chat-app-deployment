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
exports.deleteManyChatUser = exports.createManyChatUser = void 0;
const db_client_1 = require("../Utils/Database/db.client");
const getPrismaInstance = () => db_client_1.nsql_db.chatusers;
function createManyChatUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createUser = yield getPrismaInstance().createMany({
                //@ts-ignore
                data: data,
            });
            return createUser;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createManyChatUser = createManyChatUser;
function deleteManyChatUser(chat_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const createUser = yield getPrismaInstance().deleteMany({
                where: {
                    chat_id,
                    user_id: {
                        in: data,
                    },
                },
            });
            return createUser;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteManyChatUser = deleteManyChatUser;
