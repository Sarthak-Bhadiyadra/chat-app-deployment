import express, { Request, Response } from "express";
import { API_ENDPOINTS } from "../Types/Server";
import {
  createUsers,
  // listUsers,
  // updateUsers,
  // deleteUsers,
} from "../Controllers/User";
import { login } from "../Controllers/Login";
import { validateRequest } from "../Middleware/validation";
import { body } from "express-validator";

const router = express.Router();

router.post(
  API_ENDPOINTS.LOGIN,
  validateRequest([
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

export { router };
