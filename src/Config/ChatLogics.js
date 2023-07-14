export const getSender = (loggedUser, users) => {
  if (users && users.length > 0) {
    if (users[0]?.user) {
      return users[0]?.user.id === loggedUser?.id
        ? users[1]?.user.name
        : users[0]?.user.name;
    } else if (users[0].user_id) {
      return users[0]?.id === loggedUser?.id ? users[1]?.name : users[0]?.name;
    } else {
      return users[0]?.id === loggedUser?.id ? users[1]?.name : users[0]?.name;
    }
  }
};

export const getSenderFull = (loggedUser, users) => {
  if (users && users.length > 0) {
    if (users[0]?.user) {
      return users[0]?.user.id === loggedUser?.id
        ? users[1]?.user
        : users[0]?.user;
    } else {
      return users[0]?.id === loggedUser?.id ? users[1] : users[0];
    }
  }
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender.id === m.sender.id &&
    messages[i].sender.id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender.id !== m.sender.id &&
      messages[i].sender.id !== userId) ||
    (i === messages.length - 1 && messages[i].sender.id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender.id !== m.sender.id ||
      messages[i + 1].sender.id === undefined) &&
    messages[i].sender.id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender.id !== userId &&
    messages[messages.length - 1].sender.id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender.id === m.sender.id;
};
