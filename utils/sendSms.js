const Nexmo = require("nexmo");
const admin = require("firebase-admin");
const https = require("follow-redirects").https;

const apiKey = "Bx3E5Z7CyU8836tyjEONA65jhKncCGSo";

const accountSid = "AC1099fb5ef48363809ae9de3ae535cbec";
const authToken = "bd7e992979a930c85f612822f4ee4b44";
const client = require("twilio")(accountSid, authToken);

const nexmo = new Nexmo({
  apiKey: "b094304a",
  apiSecret: "dQ0CdPNRkrbBUQQY"
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

const sendSMSto = (to, text) => {
  console.debug("Mensaje a enviar :::>", text, "Token :::>" + to);
  try {
    var options = {
      method: "GET",
      hostname: "api.sms.to",
      path: `/sms/send?api_key=${apiKey}&to=${to}&message=test&sender_id=smsto`,
      maxRedirects: 20
    };

    console.debug("Options to send :::>", options);

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });
  } catch (error) {
    console.log("Error al enviar SMS ::::>", error);
  }
};

/**
 *
 * @param {*} to
 * @param {*} text
 */
const sendSMStoInfoBip = (to, text) => {
  console.debug("Mensaje a enviar :::>", text, "Token :::>" + to);
  try {
    const options = {
      method: "POST",
      hostname: "r55xdl.api.infobip.com",
      path: "/sms/2/text/advanced",
      headers: {
        Authorization:
          "App 8eaa0ce84c81d411251146f4807d1ef8-9708bfb3-8947-4b30-8ab5-0f805262b04f",
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      maxRedirects: 20
    };

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = JSON.stringify({
      messages: [
        {
          from: "InfoSMS",
          destinations: [{ to: to }],
          text: text,
          flash: false,
          language: { languageCode: "ES" },
          transliteration: "NON_UNICODE",
          intermediateReport: true,
          notifyContentType: "application/json",
          callbackData: "DLR callback data",
          validityPeriod: 720
        }
      ],
      bulkId: "BULK-ID-123-xyz",
      tracking: { track: "SMS", type: "MY_CAMPAIGN" }
    });

    req.write(postData);

    req.end();
  } catch (error) {
    console.log("Error al enviar SMS con Info BIP::::>", error);
  }
};

const sendSMSTwilio = (to, text) => {
  client.messages
    .create({
      body: text,
      messagingServiceSid: "MG8ce2560e8f755612739a05bef0699d6c",
      to: to
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

const sendNotificacionToUser = async (
  token,
  messageText,
  type = "Orden",
  params = {}
) => {
  console.debug("Mensaje a enviar :::>", messageText, "Token :::>" + token);

  await admin
    .messaging()
    .sendToDevice(
      token,
      {
        notification: {
          title: "Branch",
          body: messageText,
          icon: "ic_logo_neg_con",
          sound: "iphonenotificacion"
        },
        data: {
          type: type,
          params: JSON.stringify(params)
        }
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: "high"
      }
    )
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
  sendSMSto,
  sendSMSNexmo,
  sendSMSTwilio,
  sendSMStoInfoBip,
  sendNotificacionToUser
};
