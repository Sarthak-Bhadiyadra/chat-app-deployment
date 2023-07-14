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
exports.listAllUser = exports.userDetails = exports.checkUserExist = exports.userLogin = exports.createUser = void 0;
const db_client_1 = require("../Utils/Database/db.client");
const getPrismaInstance = () => db_client_1.nsql_db.users;
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getPrismaInstance().create({ data: data });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createUser = createUser;
function checkUserExist(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getPrismaInstance().findFirst({
                where: { email: data.email },
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.checkUserExist = checkUserExist;
function listAllUser(filter, created_by) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let where = {};
            if (created_by) {
                //@ts-ignore
                where["id"] = {
                    notIn: [created_by],
                };
            }
            if (filter && filter.length > 0) {
                //@ts-ignore
                where["OR"] = [
                    {
                        name: {
                            contains: filter,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: filter,
                            mode: "insensitive",
                        },
                    },
                ];
            }
            const data = yield getPrismaInstance().findMany({
                where: where,
            });
            return data;
        }
        catch (error) {
            console.log("error: ", error);
        }
    });
}
exports.listAllUser = listAllUser;
function userLogin(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getPrismaInstance().findFirst({
                where: { email: data.email, password: data.password },
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.userLogin = userLogin;
function userDetails(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getPrismaInstance().findFirst({ where: { id: data.id } });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.userDetails = userDetails;
