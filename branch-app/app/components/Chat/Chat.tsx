/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
} from "react-native-gifted-chat";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
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
  const { getData: getMessages } = useFetch<ListMessage>(
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
    async function fetchData() {
      const response = await getMessages();
      if (response) {
        setChatMessages(
          GiftedChat.append(
            chatMessages,
            parseServerMessagesToIMessages(response)
          )
        );
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMessages]);

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

  const parseMessage = (newmessage: any) => {
    let message = {
      _id: newmessage._id,
      createdAt: newmessage.createdAt,
      text: newmessage.text,
      delivered: false,
      read: false,
      user: {
        _id: newmessage.user._id,
        name: newmessage.user.name,
      },
      image: newmessage.image,
      IdConversacionUser: newmessage.user._id,
      IdTaller: IdTaller,
      typeusuario: "client",
    };
    return message;
  };

  const onSendFromUser = (_listMessages: any[]) => {
    /*const createdAt = new Date();
    const userMessage = user();
    const messagesToUpload = listMessages.map<never>((message: any) => ({
      ...message,
      user: userMessage,
      createdAt,
      _id: uuidv4(),
    }));*/
    onSend([]);
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight) => (
        <SafeAreaView style={{ flex: 1, marginBottom: tabBarHeight }}>
          <GiftedChat
            bottomOffset={tabBarHeight}
            messages={chatMessages}
            onSend={(newMessages) => onSend(newMessages)}
            user={user()}
            placeholder="Escriba un mensaje"
            alwaysShowSend={true}
            renderUsernameOnMessage={true}
            renderBubble={renderBuble}
            scrollToBottom
            infiniteScroll
            scrollToBottomStyle={styles.chatScrollTo}
            renderTime={renderTime}
            renderInputToolbar={renderInputToolbar}
            renderActions={() => {
              return Platform.OS === "web" ? null : (
                <CustomActions onSend={onSendFromUser} />
              );
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
        </SafeAreaView>
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

function renderBuble(props: any) {
  return (
    <Bubble
      {...props}
      // renderTime={() => <Text>Time</Text>}
      // renderTicks={() => <Text>Ticks</Text>}
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

function renderTime(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { containerStyle, wrapperStyle, ...timeProps } = props;
  return (
    <Time
      {...timeProps}
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
