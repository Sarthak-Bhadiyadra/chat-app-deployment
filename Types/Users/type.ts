import { Request } from "express";
export interface createBodyRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    profile_image: string;
  };
}

export interface createBody {
  name: string;
  email: string;
  password: string;
  profile_image: string;
}

export interface updateBodyRequest extends Request {
  body: {
    name?: string;
    email?: string;
    password?: string;
    profile_image?: string;
  };
}

export interface updateBody {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_no?: string;
  city?: string;
  state?: string;
  role_sc?: string;
  password?: string;
}

export interface loginData {
  email: string;
  password: string;
}
export interface useDetails {
  id: string;
}

export interface loginDataRequest {
  body: {
    email: string;
    password: string;
  };
}

export type JWTPayload = {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  profile_image: string;
};

export enum ROLE_SHORT_CODE {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface ListUserFilters {
  offset?: number;
  count?: number;
  start_date?: Date;
  end_date?: Date;
  filter?: {
    state?: string[];
    city?: string[];
    search?: string;
  };
  sort?: string;
}

export interface ListUserResult {
  data: any[]; // Adjust the type of `data` according to your data structure
  pagination: {
    offset: number;
    limit: number;
    count: number;
  };
}
