import { PrismaClient, Users } from "@prisma/client";
import { nsql_db } from "../Utils/Database/db.client";
const getPrismaInstance = (): PrismaClient["chatusers"] => nsql_db.chatusers;

async function createManyChatUser(data: Array<Object>) {
  try {
    const createUser = await getPrismaInstance().createMany({
      //@ts-ignore
      data: data,
    });
    return createUser;
  } catch (error) {
    console.log(error);
  }
}

async function deleteManyChatUser(chat_id: string, data: Array<string>) {
  try {
    const createUser = await getPrismaInstance().deleteMany({
      where: {
        chat_id,
        user_id: {
          in: data,
        },
      },
    });
    return createUser;
  } catch (error) {
    console.log(error);
  }
}
export { createManyChatUser, deleteManyChatUser };
