"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.permitAccess = exports.is_authorize_user = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../Models/User");
const jwtAuthSecretKey = process.env.JWT_AUTH_SECRET_KEY || "";
const is_authorize_user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(400).json({
            status: { code: 400, success: false },
            tag: "NO_TOKEN_PROVIDED",
            data: [],
            message: "Invalid authentication token.",
            errors: null,
        });
    }
    try {
        bearerToken = bearerToken === null || bearerToken === void 0 ? void 0 : bearerToken.split(" ")[1]; // because of 'Bearer' token
        const decoded = jwt.verify(bearerToken, jwtAuthSecretKey);
        req.user_id = decoded.id;
        req.user_phone = decoded.phone;
        req.user_email = decoded.email;
        const user = yield (0, User_1.userLogin)(decoded.email);
        if (!user) {
            res.json({
                message: "Invalid credentials. Please ensure valid credentials.",
                status: 401,
            });
        }
        req.user = user;
        req.user_role_sc = decoded.role_sc;
        next();
    }
    catch (e) {
        return res.status(401).json({
            status: { code: 401, success: false },
            tag: "INVALID_TOKEN",
            data: [],
            message: "Invalid authentication token.",
        });
    }
});
exports.is_authorize_user = is_authorize_user;
const permitAccess = (permittedRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        if (!user) {
            return res.send("Unauthorized access");
        }
        try {
            if (permittedRoles.includes(req === null || req === void 0 ? void 0 : req.user_role_sc) ||
                permittedRoles.includes("self")) {
                next();
            }
            else {
                return res.send("Access Denied...!");
            }
        }
        catch (e) {
            return next(e);
        }
    }
    catch (err) {
        return res.send("Something went wrong. Please try again.");
    }
});
exports.permitAccess = permitAccess;
