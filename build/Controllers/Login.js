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
exports.login = void 0;
const User_1 = require("../Models/User");
const JWT_1 = require("../Utils/JWT/");
const { body, validationResult } = require("express-validator");
// Handler for the "/users" route
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const user = yield (0, User_1.userLogin)(data);
        if (user) {
            // JWT Authentication
            const jwt_data = {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.isAdmin,
                profile_image: user.profile_image,
            };
            const token = (0, JWT_1.jwtService)().generateAuthToken(jwt_data);
            const authentication = token;
            res.json({
                status: 200,
                data: user,
                authentication,
            });
        }
        else {
            res.status(401).send("Username or password invalid");
        }
    }
    catch (error) {
        console.log("error", error);
        res.send("Something Went Wrong...!");
    }
});
exports.login = login;
