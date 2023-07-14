import { PrismaClient, Users } from "@prisma/client";
import { nsql_db } from "../Utils/Database/db.client";
const getPrismaInstance = (): PrismaClient["chat"] => nsql_db.chat;

async function isChatAvailable(user_id: string) {
  try {
    const data = await getPrismaInstance().findFirst({
      where: {
        is_group_chat: false,
        Chatusers: {
          some: {
            user_id,
          },
        },
      },
      select: {
        id: true,
        chat_name: true,
        is_group_chat: true,
        latest_message: true,
        created_by: true,
        createdAt: true,
        updatedAt: true,
        Chatusers: {
          include: {
            user: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
//@ts-ignore
async function createChat(created_by: string, user_id: string, data) {
  try {
    const createChat = await getPrismaInstance().create({
      data: {
        is_group_chat: data.is_group_chat,
        chat_name: data.chat_name,
        latest_message: data.latest_message,
        created_by,
        Chatusers: {
          createMany: {
            data: [
              {
                user_id,
              },
              {
                user_id: created_by,
              },
            ],
          },
        },
      },
      select: {
        id: true,
        chat_name: true,
        is_group_chat: true,
        latest_message: true,
        created_by: true,
        createdAt: true,
        updatedAt: true,
        Chatusers: {
          select: {
            user: true,
          },
        },
      },
    });
    return createChat;
  } catch (error) {}
}

async function listOfAllChat(user_id: string) {
  try {
    return await getPrismaInstance().findMany({
      where: {
        Chatusers: {
          some: {
            user_id,
          },
        },
      },
      select: {
        id: true,
        chat_name: true,
        is_group_chat: true,
        latest_message: true,
        created_by: true,
        Chatusers: {
          select: {
            user: true,
          },
        },
      },
    });
  } catch (error) {}
}
async function createGroupChat(
  created_by: string,
  data: { name: string; users: [] }
) {
  try {
    const prepareData = data.users.map((e) => {
      return {
        user_id: e,
      };
    });
    const createGroupChat = await getPrismaInstance().create({
      data: {
        chat_name: data.name,
        is_group_chat: true,
        latest_message: "",
        created_by,
        Chatusers: {
          createMany: {
            data: prepareData,
          },
        },
      },
      select: {
        id: true,
        chat_name: true,
        is_group_chat: true,
        latest_message: true,
        created_by: true,
        Chatusers: {
          include: {
            user: true,
          },
        },
      },
    });
    return createGroupChat;
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
}

async function getChatDetails(chat_id: string) {
  try {
    return await getPrismaInstance().findFirst({
      where: {
        id: chat_id,
      },
      select: {
        id: true,
        chat_name: true,
        is_group_chat: true,
        latest_message: true,
        created_by: true,
        Chatusers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {}
}
async function changeChatName(id: string, data: string) {
  try {
    const changeChatName = await getPrismaInstance().update({
      //@ts-ignore
      where: {
        id,
      },
      //@ts-ignore
      data: {
        //@ts-ignore
        chat_name: data,
      },
    });
    return changeChatName;
  } catch (error) {
    console.log(error);
  }
}

async function changeChatLatestMessage(id: string, data: string) {
  try {
    const changeChatName = await getPrismaInstance().update({
      //@ts-ignore
      where: {
        id,
      },
      //@ts-ignore
      data: {
        //@ts-ignore
        latest_message: data,
      },
    });
    return changeChatName;
  } catch (error) {
    console.log(error);
  }
}

export {
  isChatAvailable,
  createChat,
  listOfAllChat,
  createGroupChat,
  changeChatName,
  getChatDetails,
  changeChatLatestMessage,
};
