import admin from "firebase-admin";
import twilio from "twilio";
import { https } from "follow-redirects";
//TODO: Remove this follow redirects library
import Debug from "debug";
import {
  CitaAttributes,
  CitaInstance,
  MecanicoInstance,
  VehiculoInstance,
} from "../types";
import moment from "moment";
const debug = Debug("branch:server");

const accountSid = process.env.TWILIO_ACCOUNT_ID || "AC1111";
const authToken = process.env.TWILIO_AUTH_TOKEN || "111";
const client = twilio(accountSid, authToken);

/**
 *
 * @param {*} to
 * @param {*} text
 */
export const sendSMStoInfoBip = (to: string, text: string): void => {
  debug("Mensaje a enviar :::>", text, "Token :::>" + to);
  try {
    const options = {
      method: "POST",
      hostname: "r55xdl.api.infobip.com",
      path: "/sms/2/text/advanced",
      headers: {
        Authorization:
          "App 8eaa0ce84c81d411251146f4807d1ef8-9708bfb3-8947-4b30-8ab5-0f805262b04f",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      maxRedirects: 20,
    };

    const req = https.request(options, (res) => {
      const chunks: Uint8Array[] = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", (error) => {
        console.error(error);
      });
    });

    const postData = JSON.stringify({
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
          validityPeriod: 720,
        },
      ],
      bulkId: "BULK-ID-123-xyz",
      tracking: { track: "SMS", type: "MY_CAMPAIGN" },
    });

    req.write(postData);

    req.end();
  } catch (error) {
    console.log("Error al enviar SMS con Info BIP::::>", error);
  }
};

export const sendSMSTwilio = (to: string, text: string) => {
  client.messages
    .create({
      body: text,
      messagingServiceSid: "MG8ce2560e8f755612739a05bef0699d6c",
      to: to,
    })
    .then((message) => {
      debug("Message sent successfully a ", to, "Result ::::>", message.sid);
    })
    .catch((e) => {
      console.error("Error al enviar SMS a twilio:", e.code, e.message);
    });
};

export const sendNotificacionToUser = async (
  token: string,
  messageText: string,
  type = "Orden",
  params = {}
) => {
  await admin
    .messaging()
    .sendToDevice(
      token,
      {
        notification: {
          title: "Branch",
          body: messageText,
          icon: "ic_logo_neg_con",
          sound: "iphonenotificacion",
        },
        data: {
          type: type,
          params: JSON.stringify(params),
        },
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: "high",
      }
    )
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

export const sendDataToUser = async (
  token: string,
  type = "Orden",
  params = {}
) => {
  await admin
    .messaging()
    .sendToDevice(
      token,
      {
        data: {
          type: type,
          params: JSON.stringify(params),
        },
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: "high",
      }
    )
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully send data to device:", response);
    })
    .catch((error) => {
      console.log("Error send data to device", error);
    });
};

export const parseTextoSms = (
  mecanico: MecanicoInstance | null,
  vehiculo: VehiculoInstance,
  cita: CitaInstance
) => {
  if (mecanico) {
    //Texto de cita con mecanico
    return (
      "Hola " +
      vehiculo.usuarios?.firstName +
      "! Te esperamos el " +
      moment(cita.fechaCita).format("D [de] MMMM YYYY") +
      " a las " +
      cita.horaCita +
      " con tu " +
      vehiculo.tipoVehiculo +
      "  " +
      vehiculo.placa +
      ", " +
      mecanico.firstName +
      " de BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH"
    );
  } else {
    //Texto de cita sin mecanico
    return (
      "Hola " +
      vehiculo.usuarios?.firstName +
      "! Te esperamos el " +
      moment(cita.fechaCita).format("D [de] MMMM YYYY") +
      " a las " +
      cita.horaCita +
      " con tu " +
      vehiculo.tipoVehiculo +
      "  " +
      vehiculo.placa +
      ", BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH"
    );
  }
};

export const parseTextByEstadoCita = (
  estado: string,
  cita: CitaAttributes
): string | undefined => {
  switch (estado) {
    case "Confirmada":
      return "Se confirmo su cita exitosamente";
    case "Cancelada":
      return (
        "Hola " +
        cita.vehiculo?.usuarios?.firstName +
        "! Se cancelo la cita que tenias el " +
        moment(cita.fechaCita).format("D [de] MMMM YYYY") +
        " a las " +
        cita.horaCita +
        " con tu " +
        cita.vehiculo?.tipoVehiculo +
        "  " +
        cita.vehiculo?.placa +
        ", BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH"
      );
    case "Incumplida":
      return `Hola " +
        ${
          cita.vehiculo?.usuarios?.firstName
        }! Incumpliste la cita que tenias el 
        ${moment(cita.fechaCita).format("D [de] MMMM YYYY")} a las ${
        cita.horaCita
      } con tu 
        ${cita.vehiculo?.tipoVehiculo} ${
        cita.vehiculo?.placa
      }, esto afectara tu puntuacion en nuestra plataforma.
        BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH`;
    default:
      `Hola 
      ${cita.vehiculo?.usuarios?.firstName}! Su cita quedo asignada el 
      ${moment(cita.fechaCita).format("D [de] MMMM YYYY")} a las ${
        cita.horaCita
      } con tu 
      ${cita.vehiculo?.tipoVehiculo} ${cita.vehiculo?.placa},
      ${
        cita.mecanico?.firstName
      } de BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH`;
  }
};
