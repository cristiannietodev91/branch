/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import { Icon } from "@rneui/themed";
import {
  GiftedChat,
  Send,
  InputToolbar,
  Bubble,
  Time,
  IMessage,
  InputToolbarProps,
  ComposerProps,
  Composer,
  BubbleProps,
  TimeProps,
} from "react-native-gifted-chat";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { v4 as uuidv4 } from "uuid";
import CustomActions from "./CustomActions";
import auth from "@react-native-firebase/auth";
import { URL_SERVICES } from "@env";
import SocketIOClient from "socket.io-client";
import styles from "../../styles/App.scss";
import { ListMessage } from "../../../types/types";
import useFetch from "../../hooks/useFetch";
import { parseServerMessagesToIMessages } from "../../utils/parse";

const socket = SocketIOClient(URL_SERVICES, {
  transports: ["websocket"],
});

interface ChatComponentProps {
  IdTaller: number;
}

export default function Chat(props: ChatComponentProps) {
  const { IdTaller } = props;
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const { getData: getMessages, data: messages } = useFetch<ListMessage>(
    "message/getMessagesByConversacion",
    {
      IdConversacionUser: auth().currentUser?.uid,
      IdTaller: IdTaller,
      order: "DESC",
    }
  );

  const user = () => {
    return {
      name: auth().currentUser?.displayName || "Undefined",
      _id: auth().currentUser?.uid || "Undefined",
    };
  };

  useEffect(() => {
    socket.emit(
      "joinroom",
      { room: auth().currentUser?.uid, IdTaller: IdTaller },
      (resultado: any) => {
        console.log("Resultado de unirse al room de firebase", resultado);
      }
    );
  }, [IdTaller]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    if (messages) {
      setChatMessages(parseServerMessagesToIMessages(messages));
    }
  }, [messages]);

  useEffect(() => {
    socket.on("sendmessage", (message: any) => {
      setChatMessages(GiftedChat.append(chatMessages, message));
    });
  }, [chatMessages]);

  const onSend = (newMessage: IMessage[]) => {
    const sentMessages = [{ ...newMessage[0], sent: true, received: true }];
    setChatMessages(
      GiftedChat.append(chatMessages, sentMessages, Platform.OS !== "web")
    );
    socket.emit(
      "messaggetosomeone",
      auth().currentUser?.uid,
      parseMessage(newMessage[0])
    );
  };

  const parseMessage = (newMessage: IMessage) => {
    let message = {
      _id: newMessage._id,
      createdAt: newMessage.createdAt,
      text: newMessage.text,
      delivered: false,
      read: false,
      user: {
        _id: newMessage.user._id,
        name: newMessage.user.name,
      },
      image: newMessage.image,
      IdConversacionUser: newMessage.user._id,
      IdTaller: IdTaller,
      typeusuario: "client",
    };
    return message;
  };

  const onSendFromUser = (imageUrl: string) => {
    const createdAt = new Date();
    const userMessage = user();
    const message: IMessage = {
      user: userMessage,
      createdAt,
      _id: uuidv4(),
      image: imageUrl,
      text: "",
    };
    onSend([message]);
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight) => (
        <View style={{ flex: 1, marginBottom: (tabBarHeight || 0) + 17 }}>
          <GiftedChat
            bottomOffset={Platform.OS === "ios" ? tabBarHeight : 0}
            messages={chatMessages}
            onSend={(newMessages) => onSend(newMessages)}
            user={user()}
            placeholder="Escriba un mensaje"
            alwaysShowSend={true}
            renderUsernameOnMessage={true}
            renderBubble={renderBubble}
            scrollToBottom
            infiniteScroll
            scrollToBottomStyle={styles.chatScrollTo}
            renderTime={renderTime}
            renderInputToolbar={renderInputToolbar}
            renderActions={() => {
              return <CustomActions onSend={onSendFromUser} />;
            }}
            renderComposer={renderInputComposer}
            renderSend={(sendProps: IMessage) => {
              return (
                <Send {...sendProps} containerStyle={styles.chatSendContainer}>
                  <View style={styles.iconButton}>
                    <Icon
                      containerStyle={styles.iconButtonIcon}
                      name="send"
                      type="material-community"
                      color="#0396c8"
                      size={25}
                    />
                  </View>
                </Send>
              );
            }}
          />
        </View>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
}

function renderInputComposer(props: ComposerProps) {
  return <Composer {...props} textInputStyle={styles.chatInput} />;
}

function renderInputToolbar(props: InputToolbarProps<IMessage>) {
  return (
    <InputToolbar {...props} containerStyle={styles.chatToolbarContainer} />
  );
}

function renderBubble(props: Readonly<BubbleProps<IMessage>>) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#8bd2e8",
          borderRadius: 10,
          padding: 3,
          margin: 3,
        },
        left: {
          backgroundColor: "#a5e1ef",
          borderRadius: 10,
          padding: 3,
          margin: 3,
        },
      }}
      textStyle={{
        right: {
          color: "#041c24",
          fontSize: 15,
        },
        left: {
          color: "#041c24",
          fontSize: 15,
        },
      }}
    />
  );
}

function renderTime(props: TimeProps<IMessage>) {
  return (
    <Time
      {...props}
      timeTextStyle={{
        right: {
          color: "#0396c8",
        },
        left: {
          color: "#0396c8",
        },
      }}
    />
  );
}
