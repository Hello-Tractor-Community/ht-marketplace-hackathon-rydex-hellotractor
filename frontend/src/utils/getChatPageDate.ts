import dayjs from "dayjs";

export const getChatPageDate = (date: string) => {
  const today = dayjs();
  const chatDate = dayjs(date);

  if (chatDate.isSame(today, "day")) {
    return chatDate.format("HH:mm");
  }

  if (chatDate.isSame(today.subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  if (chatDate.diff(today, "day") > -7) {
    return chatDate.format("dddd");
  }

  return chatDate.format("DD/MM/YYYY");
};
