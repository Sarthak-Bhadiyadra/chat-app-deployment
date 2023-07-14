import * as jwt from "jsonwebtoken";
import { JWTPayload } from "../../Types/Users/type";

export interface IJWTData {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
  profile_image: string;
  deviceToken?: string;
  expiry?: number;
}

const jwt_access_secret_key = process.env.JWT_AUTH_SECRET_KEY || "";
const jwt_access_token_expiry = process.env.ACCESS_TOKEN_VALIDITY_SECS || "";

export function jwtService() {
  return {
    generateAuthToken: ({
      id,
      email,
      name,
      is_admin,
      profile_image,
    }: JWTPayload): string => {
      return jwt.sign(
        {
          id,
          email,
          name,
          is_admin,
          profile_image,
        },
        jwt_access_secret_key,
        {}
      );
    },
  };
}
