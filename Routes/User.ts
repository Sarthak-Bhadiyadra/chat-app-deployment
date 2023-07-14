import express, { Request, Response } from "express";
import { body } from "express-validator";
import { API_ENDPOINTS } from "../Types/Server";
import {
  createUsers,
  listAllUsers,
  // updateUsers,
  // deleteUsers,
  // detailsUsers,
} from "../Controllers/User";
import { is_authorize_user, permitAccess } from "../Middleware/auth";
import { ROLE_SHORT_CODE } from "../Types/Users/type";
import { validateRequest } from "../Middleware/validation";
import { login } from "../Controllers/Login";
const chats = require("../data/data");

const router = express.Router();

router.post(
  API_ENDPOINTS.LOGIN,
  validateRequest([
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

router.post(
  API_ENDPOINTS.CREATE,
  validateRequest([
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("password").notEmpty().withMessage("Password is required."),
    body("profile_image").notEmpty().withMessage("profile_image is required."),
  ]),
  createUsers
);

router.get(
  API_ENDPOINTS.ALL_USERS,
  is_authorize_user,
  permitAccess(["self"]),
  listAllUsers
);
// router.get(
//   API_ENDPOINTS.DETAILS,
//   is_authorize_user,
//   permitAccess([ROLE_SHORT_CODE.ADMIN]),
//   detailsUsers
// );

// router.patch(
//   API_ENDPOINTS.UPDATE,
//   is_authorize_user,
//   permitAccess([ROLE_SHORT_CODE.ADMIN]),
//   validateRequest([
//     body("first_name")
//       .optional()
//       .notEmpty()
//       .withMessage("First name is required."),
//     body("last_name")
//       .optional()
//       .notEmpty()
//       .withMessage("Last name is required."),
//     body("email").optional().isEmail().withMessage("Invalid email address."),
//     // Additional validations for the update route
//   ]),
//   updateUsers
// );

// router.delete(
//   API_ENDPOINTS.DELETE,
//   is_authorize_user,
//   permitAccess([ROLE_SHORT_CODE.ADMIN]),
//   deleteUsers
// );

export { router };
