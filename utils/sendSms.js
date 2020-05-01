const Nexmo = require("nexmo");
var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

/*
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://branch-263701.firebaseio.com'
});
*/

const accountSid = "AC1099fb5ef48363809ae9de3ae535cbec";
const authToken = "bd7e992979a930c85f612822f4ee4b44";
const client = require("twilio")(accountSid, authToken);

const nexmo = new Nexmo({
  apiKey: "b094304a",
  apiSecret: "dQ0CdPNRkrbBUQQY",
});

const sendSMSNexmo = (to, text) => {
  const from = "NEXMO";

  nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully a ", to);
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};

const sendSMSTwilio = (to, text) => {
  client.messages
    .create({
      body: text,
      messagingServiceSid: "MG8ce2560e8f755612739a05bef0699d6c",
      to: to,
    })
    .then((message) => {
      console.log(
        "Message sent successfully a ",
        to,
        "Result ::::>",
        message.sid
      );
    })
    .catch((e) => {
      console.error("Error al enviar SMS a twilio:", e.code, e.message);
    })
    .done();
};

const sendNotificacionToUser = async (token, messageText) => {
  /*let message = {
    data: {
      message: messageText,
    },
  };*/

  console.log("Mensaje a enviar :::>", messageText, "Token :::>" + token);

  await admin
    .messaging()
    .sendMulticast({
      tokens: [
        token,
        /* ... */
      ], // ['token_1', 'token_2', ...]
      notification: {
        title: "Branch",
        body: messageText,
      },
    })
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  // Send a message to the device corresponding to the provided
  // registration token.
  /*admin
    .messaging()
    .sendMulticast([token], message, {
      // Required for background/quit data-only messages on iOS
      contentAvailable: true,
      // Required for background/quit data-only messages on Android
      priority: "high",
    })
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });*/
};

module.exports = {
  sendSMSNexmo,
  sendSMSTwilio,
  sendNotificacionToUser,
};
