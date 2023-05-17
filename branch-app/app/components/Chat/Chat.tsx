import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import { Image, Icon } from "@rneui/themed";
import {
  GiftedChat,
  Send,
  InputToolbar,
  Bubble,
  Time,
  IMessage,
} from "react-native-gifted-chat";
import CustomActions from "./CustomActions";
import auth from "@react-native-firebase/auth";
import { URL_SERVICES } from "@env";
import SocketIOClient from "socket.io-client";
import styles from "../../styles/App.scss";

const socket = SocketIOClient(URL_SERVICES, {
  transports: ["websocket"],
});

interface ChatComponentProps {
  IdTaller: number;
}

export default function Chat(props: ChatComponentProps) {
  const { IdTaller } = props;

  const [messages, setMessages] = useState<never[]>([]);

  const user = () => {
    return {
      name: auth().currentUser?.displayName || "Undefined",
      _id: auth().currentUser?.uid || "Undefined",
    };
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connection");
    });

    socket.emit(
      "joinroom",
      { room: auth().currentUser?.uid, IdTaller: IdTaller },
      (resultado: any) => {
        console.log("Resultado de unirse al room de firebase", resultado);
      }
    );
  }, [IdTaller]);

  useEffect(() => {
    fetch(
      URL_SERVICES +
        `message/getMessagesByConversacion?IdConversacionUser=${
          auth().currentUser?.uid
        }&IdTaller=${IdTaller}&order=DESC`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setMessages(GiftedChat.append(messages, json));
      })
      .catch((error) => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IdTaller]);

  useEffect(() => {
    socket.on("sendmessage", (message: any) => {
      setMessages(GiftedChat.append(messages, message));
    });
  }, [messages]);

  const onSend = (newmessage: never[]) => {
    setMessages(GiftedChat.append(messages, newmessage));
    socket.emit(
      "messaggetosomeone",
      auth().currentUser?.uid,
      parseMessage(newmessage[0])
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
    <View style={styles.scrollContainer}>
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => onSend(newMessage)}
        user={user()}
        placeholder="Escriba un mensaje"
        alwaysShowSend={true}
        renderUsernameOnMessage={true}
        renderBubble={renderBuble}
        scrollToBottom={true}
        scrollToBottomStyle={styles.chatScrollTo}
        renderTime={renderTime}
        renderInputToolbar={renderInputToolbar}
        textInputProps={styles.chatInput}
        renderActions={() => {
          return Platform.OS === "web" ? null : (
            <CustomActions onSend={onSendFromUser} />
          );
        }}
        renderSend={(sendProps: IMessage) => {
          return (
            <Send {...sendProps} containerStyle={styles.chatSendContainer}>
              <View style={styles.iconButton}>
                <Image
                  source={require("./../../../assets/drawable-xxxhdpi/button.png")}
                  style={styles.iconButtonImage}
                />
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
  );
}

function renderInputToolbar(props: any) {
  return (
    <InputToolbar
      {...props}
      containerStyle={styles.chatToolbarContainer}
      placeholderTextColor={"#0396c8"}
    />
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
