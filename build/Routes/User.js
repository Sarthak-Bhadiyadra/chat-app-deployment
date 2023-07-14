"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Server_1 = require("../Types/Server");
const User_1 = require("../Controllers/User");
const auth_1 = require("../Middleware/auth");
const validation_1 = require("../Middleware/validation");
const Login_1 = require("../Controllers/Login");
const chats = require("../data/data");
const router = express_1.default.Router();
exports.router = router;
router.post(Server_1.API_ENDPOINTS.LOGIN, (0, validation_1.validateRequest)([
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
]), Login_1.login);
router.post(Server_1.API_ENDPOINTS.CREATE, (0, validation_1.validateRequest)([
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required."),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address."),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required."),
    (0, express_validator_1.body)("profile_image").notEmpty().withMessage("profile_image is required."),
]), User_1.createUsers);
router.get(Server_1.API_ENDPOINTS.ALL_USERS, auth_1.is_authorize_user, (0, auth_1.permitAccess)(["self"]), User_1.listAllUsers);
