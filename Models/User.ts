import { PrismaClient, Users } from "@prisma/client";
import { nsql_db } from "../Utils/Database/db.client";
import {
  // ListUserFilters,
  // ListUserResult,
  createBody,
  loginData,
  // updateBody,
  useDetails,
} from "../Types/Users/type";
const getPrismaInstance = (): PrismaClient["users"] => nsql_db.users;

async function createUser(data: createBody) {
  try {
    return await getPrismaInstance().create({ data: data });
  } catch (error) {
    console.log(error);
  }
}

async function checkUserExist(data: createBody) {
  try {
    return await getPrismaInstance().findFirst({
      where: { email: data.email },
    });
  } catch (error) {
    console.log(error);
  }
}

async function listAllUser(filter: string, created_by?: string) {
  try {
    let where: object = {};
    if (created_by) {
      //@ts-ignore
      where["id"] = {
        notIn: [created_by],
      };
    }
    if (filter && filter.length > 0) {
      //@ts-ignore
      where["OR"] = [
        {
          name: {
            contains: filter,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: filter,
            mode: "insensitive",
          },
        },
      ];
    }
    const data = await getPrismaInstance().findMany({
      where: where,
    });
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
}

async function userLogin(data: loginData) {
  try {
    return await getPrismaInstance().findFirst({
      where: { email: data.email, password: data.password },
    });
  } catch (error) {
    console.log(error);
  }
}
async function userDetails(data: useDetails) {
  try {
    return await getPrismaInstance().findFirst({ where: { id: data.id } });
  } catch (error) {
    console.log(error);
  }
}

export {
  createUser,
  // listUser,
  // updateUser,
  // deleteUser,
  userLogin,
  checkUserExist,
  userDetails,
  listAllUser,
};
