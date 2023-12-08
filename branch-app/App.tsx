import React, { useState, useEffect } from "react";
import Navigation from "./app/navigation/navigation";
import messaging from "@react-native-firebase/messaging";
import { NotificationContext } from "./app/context/ContextNotifications";

export default function App() {
  const resetNotificaciones = () => {
    setContextNotificaciones((prevState) => {
      return {
        ...prevState,
        value: 0,
      };
    });
  };

  const [contextNotificaciones, setContextNotificaciones] = useState({
    value: 0,
    resetNotificaciones,
  });

  useEffect(() => {
    // SplashScreen.show();

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      );
      if (remoteMessage) {
        const { data } = remoteMessage;
        console.log("Data :::>", data);
        /*const { type } = data;
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        if (type === "vehiculo") {
          //NavigationService.navigate("Vehiculos", {});
        } else {
          if (type === "chat") {
            /*const paramsParse = JSON.parse(params);
            const { IdTaller } = paramsParse;
            NavigationService.navigate("chat", {
              IdTaller: IdTaller,
            });
          } else {
            /*const paramsParse = JSON.parse(params);
            const { IdCita } = paramsParse;
            //NavigationService.navigate("Citas", { IdCita: IdCita });
          }
          */
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const { data } = remoteMessage;
          console.log("Data 1:::>", data);
          /*const { type, params } = data;
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          if (type === "vehiculo") {
            NavigationService.navigate("Vehiculos", {});
          } else {
            if (type === "chat") {
              const paramsParse = JSON.parse(params);
              const { IdTaller } = paramsParse;
              NavigationService.navigate("chat", {
                IdTaller: IdTaller,
              });
            } else {
              NavigationService.navigate("Citas", {});
            }
          }*/
        }
        //setLoading(false);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { data } = remoteMessage;
      console.log("Data 2:::>", data);
      /*const { type, IdTaller } = data;
      if (type === "chat") {
        console.log(`Remote message tipo chat `);
        const { value: newNotificaciones } = contextNotificaciones;
        setContextNotificaciones({
          value: newNotificaciones + 1,
          resetNotificaciones,
        });
      } else {
        console.log(`Remote message ${remoteMessage.data} `);
      }*/
    });
    return unsubscribe;
  }, [contextNotificaciones]);

  return (
    <NotificationContext.Provider value={contextNotificaciones}>
      <Navigation />
    </NotificationContext.Provider>
  );
}
