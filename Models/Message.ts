import { PrismaClient, Users, message } from "@prisma/client";
import { nsql_db } from "../Utils/Database/db.client";
const getPrismaInstance = (): PrismaClient["message"] => nsql_db.message;

async function conversation(chat_id: string, latest?: Boolean) {
  try {
    if (latest) {
      const data = await getPrismaInstance().findFirst({
        where: {
          chat_id: chat_id,
        },
        select: {
          id: true,
          chat_id: true,
          sender_id: true,
          content: true,
          sender: {
            select: {
              id: true,
              name: true,
              profile_image: true,
              email: true,
            },
          },
          chat: {
            select: {
              Chatusers: {
                select: {
                  id: true,
                  chat_id: true,
                  user_id: true,
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              chat_name: true,
              created_by: true,
              id: true,
              is_group_chat: true,
              latest_message: true,
            },
          },
        },
        take: 1,
        orderBy: {
          id: "desc",
        },
      });
      return data;
    }
    const data = await getPrismaInstance().findMany({
      where: {
        chat_id: chat_id,
      },
      select: {
        id: true,
        chat_id: true,
        sender_id: true,
        content: true,
        sender: {
          select: {
            id: true,
            name: true,
            profile_image: true,
            email: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
async function createMessage(data: message) {
  try {
    const createMessage = await getPrismaInstance().create({
      data,
      select: {
        id: true,
        chat_id: true,
        content: true,
        read_by: true,
      },
    });
    return createMessage;
  } catch (error) {
    console.log(error);
  }
}
export { conversation, createMessage };
