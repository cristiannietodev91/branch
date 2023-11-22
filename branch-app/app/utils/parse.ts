import { IMessage } from "react-native-gifted-chat";
import { ListMessage } from "../../types/types";

export const parseServerMessagesToIMessages = (
  serverMessages: ListMessage
): IMessage[] => {
  return serverMessages.map<IMessage>((message) => {
    return {
      _id: message._id,
      text: message.text,
      createdAt: Date.parse(message.createdAt),
      user: {
        _id: message.user._id,
        name: message.user.name,
      },
    };
  });
};
