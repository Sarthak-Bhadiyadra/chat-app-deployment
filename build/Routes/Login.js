"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const Server_1 = require("../Types/Server");
const Login_1 = require("../Controllers/Login");
const validation_1 = require("../Middleware/validation");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
exports.router = router;
router.post(Server_1.API_ENDPOINTS.LOGIN, (0, validation_1.validateRequest)([
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
]), Login_1.login);
