import { Request, Response } from "express";
import {
  JWTPayload,
  createBodyRequest,
  loginData,
  loginDataRequest,
  updateBodyRequest,
} from "../Types/Users/type";
import { userLogin } from "../Models/User";
import { jwtService } from "../Utils/JWT/";
const { body, validationResult } = require("express-validator");

// Handler for the "/users" route
const login = async (req: loginDataRequest, res: Response) => {
  const data: loginDataRequest["body"] = req.body;
  try {
    const user = await userLogin(data);
    if (user) {
      // JWT Authentication
      const jwt_data: JWTPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.isAdmin,
        profile_image: user.profile_image,
      };
      const token: string = jwtService().generateAuthToken(jwt_data);
      const authentication = token;
      res.json({
        status: 200,
        data: user,
        authentication,
      });
    } else {
      res.status(401).send("Username or password invalid");
    }
  } catch (error) {
    console.log("error", error);
    res.send("Something Went Wrong...!");
  }
};

export { login };
