import * as jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userLogin } from "../Models/User";

const jwtAuthSecretKey = process.env.JWT_AUTH_SECRET_KEY || "";

export const is_authorize_user: RequestHandler = async (
  req: Request & {
    user_id?: string;
    user_phone?: string;
    user_email?: string;
    user?: any;
    user_role_sc?: string;
  },
  res: Response,
  next: NextFunction
) => {
  let bearerToken: string | undefined = req.headers.authorization;

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
    bearerToken = bearerToken?.split(" ")[1]; // because of 'Bearer' token
    const decoded: any = jwt.verify(bearerToken, jwtAuthSecretKey);

    req.user_id = decoded.id;
    req.user_phone = decoded.phone;
    req.user_email = decoded.email;

    const user = await userLogin(decoded.email);

    if (!user) {
      res.json({
        message: "Invalid credentials. Please ensure valid credentials.",
        status: 401,
      });
    }

    req.user = user;
    req.user_role_sc = decoded.role_sc;

    next();
  } catch (e) {
    return res.status(401).json({
      status: { code: 401, success: false },
      tag: "INVALID_TOKEN",
      data: [],
      message: "Invalid authentication token.",
    });
  }
};

export const permitAccess =
  (permittedRoles: any) =>
  async (
    req: Request & { user?: any; user_role_sc?: string },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = req;
      if (!user) {
        return res.send("Unauthorized access");
      }

      try {
        if (
          permittedRoles.includes(req?.user_role_sc) ||
          permittedRoles.includes("self")
        ) {
          next();
        } else {
          return res.send("Access Denied...!");
        }
      } catch (e) {
        return next(e);
      }
    } catch (err: unknown) {
      return res.send("Something went wrong. Please try again.");
    }
  };
