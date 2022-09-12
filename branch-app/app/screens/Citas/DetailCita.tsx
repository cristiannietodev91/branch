import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { Image, Button, Input, Icon } from "@rneui/base";
import Moment from "moment";
import ReactSteps, { Step } from "../../components/steeper/steeper";
import GalleryList from "../../components/GalleryList";

import ActionButton from "react-native-action-button";
import { URL_SERVICES } from "@env";
import { useForm } from "react-hook-form";
import styles from "../../styles/App.scss";
import { ActiveAppoinmentStackScreenProps } from "../../../types/types";

type FormData = {
  comentario: string;
};

export default function DetailCita({
  navigation,
  route,
}: ActiveAppoinmentStackScreenProps<"Detail">) {
  const { cita } = route.params;
  const [currentPosition, setCurrentPosition] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [, setReload] = useState(false);

  const handleChanged = (value: number) => {
    setCurrentPosition(value);
  };

  useEffect(() => {
    register("comentario", {
      required: {
        value: true,
        message: "Debe ingresar un comentario de aprobación o rechazo",
      },
    });
  }, [register]);

  const aprobarCotizacion = async (data: any) => {
    let orden = cita.ordentrabajos[2];
    let ordenToUpdate = orden;
    ordenToUpdate.estado = "Aceptado";
    ordenToUpdate.Observaciones =
      orden.Observaciones +
      " \r\n " +
      " Comentario aprobación del cliente: \r\n" +
      " " +
      data.comentario;

    fetch(URL_SERVICES + "orden/update/" + ordenToUpdate.IdOrdenTrabajo, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordenToUpdate),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Respuesta actualizar estado orden::>", json);
      })
      .catch((error) => console.error(error));

    let ordenCreate = {
      IdTaller: orden.IdTaller,
      CodigoOrden: orden.CodigoOrden,
      IdEtapa: 5,
      IdCita: orden.IdCita,
      IdMecanico: orden.IdMecanico,
      IdVehiculo: orden.IdVehiculo,
      Observaciones: "El cliente aprueba la cotizacion desde la App",
      estado: "Aceptado",
    };

    fetch(URL_SERVICES + "orden/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordenCreate),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Respuesta crear orden de aprobacion::>", json);
        cita.ordentrabajos.push(json.orden);
        setReload(true);
      })
      .catch((error) => console.error(error));
  };

  const rechazarCotizacion = (data: any) => {
    let orden = cita.ordentrabajos[2];
    let ordenToUpdate = orden;
    ordenToUpdate.estado = "Rechazado";
    ordenToUpdate.Observaciones =
      orden.Observaciones +
      " \r\n " +
      " Comentario rechazo del cliente: \r\n" +
      " " +
      data.comentario;

    fetch(URL_SERVICES + "orden/update/" + ordenToUpdate.IdOrdenTrabajo, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordenToUpdate),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Respuesta actualizar estado orden::>", json);
        setReload(true);
      })
      .catch((error) => console.error(error));
  };

  let PhotosDiagnostico: Array<any>;

  if (cita.ordentrabajos.length > 1) {
    PhotosDiagnostico = cita.ordentrabajos[1].documentos.map(
      (img: any, index: number) => ({
        URI: img.url,
        thumbnail: img.url,
        id: String(index),
        title: img.nombrearchivo,
        description: img.nombrearchivo,
      })
    );
  }

  let PhotosReparacion: Array<any>;

  if (cita.ordentrabajos.length > 4) {
    PhotosReparacion = cita.ordentrabajos[4].documentos.map(
      (img: any, index: number) => ({
        URI: img.url,
        thumbnail: img.url,
        id: String(index),
        title: img.nombrearchivo,
        description: img.nombrearchivo,
      })
    );
  }

  let pdfCotizacion: any;

  if (cita.ordentrabajos.length > 2) {
    pdfCotizacion = {
      uri: cita.ordentrabajos[2].documentos[0].url,
      cache: true,
    };
  }

  let pdfFactura: any;
  if (cita.ordentrabajos.length > 5) {
    pdfFactura = {
      uri: cita.ordentrabajos[5].documentos[0].url,
      cache: true,
    };
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#d7f8f8" }}>
      <View style={styles.scrollContainer}>
        <Cita cita={cita} />

        <ReactSteps
          currentPosition={currentPosition}
          multiple={false}
          onHandleChange={handleChanged}
        >
          <Step style={styles.stepperStep} title="Ingreso">
            <Text style={styles.bodyText}>
              Fecha ingreso:{" "}
              <Text style={styles.bodyTextBold}>
                {Moment(cita.ordentrabajos[0].createdAt).format(
                  "DD/MM/YYYY hh:mm A"
                )}
              </Text>
            </Text>
            <Text style={styles.bodyText}>
              Kilometraje:{" "}
              <Text style={styles.bodyTextBold}>
                {cita.ordentrabajos[0].kilometraje} Km
              </Text>
            </Text>
            <Text style={styles.bodyText}>
              Mecánico:{" "}
              <Text style={styles.bodyTextBold}>
                {cita.ordentrabajos[0].mecanico.fullName}
              </Text>
            </Text>
            <Text style={styles.bodyText}>
              Observaciones:{" "}
              <Text style={styles.bodyTextBold}>
                {cita.ordentrabajos[0].Observaciones}
              </Text>
            </Text>
            <Text style={styles.bodyText}>
              Documentos:{" "}
              <Text style={styles.bodyTextBold}>
                {cita.ordentrabajos[0].DocumentosDeja}
              </Text>
            </Text>
          </Step>
          {cita.ordentrabajos.length > 1 && (
            <Step title="Diagnóstico">
              <Text style={styles.bodyText}>
                Fecha:{" "}
                <Text style={styles.bodyTextBold}>
                  {Moment(cita.ordentrabajos[1].createdAt).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </Text>
              </Text>
              <Text style={styles.bodyText}>
                Mecánico:{" "}
                <Text style={styles.bodyTextBold}>
                  {cita.ordentrabajos[1].mecanico.fullName}
                </Text>
              </Text>
              <GalleryList images={PhotosDiagnostico} itemsToRender={2} />

              {/* <ImageBrowser images={PhotosDiagnostico} /> */}
            </Step>
          )}

          {cita.ordentrabajos.length > 2 && (
            <Step title="Cotización">
              <Text style={styles.bodyText}>
                Fecha:{" "}
                <Text style={styles.bodyTextBold}>
                  {Moment(cita.ordentrabajos[2].createdAt).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </Text>
              </Text>
              <Text style={styles.bodyText}>
                Mecánico:{" "}
                <Text style={styles.bodyTextBold}>
                  {cita.ordentrabajos[2].mecanico.fullName}
                </Text>
              </Text>
              <Text style={styles.bodyText}>
                Observaciones:{" "}
                <Text style={styles.bodyTextBold}>
                  {cita.ordentrabajos[2].Observaciones}
                </Text>
              </Text>
              <Button
                buttonStyle={styles.buttonPrimary}
                titleStyle={styles.buttonText}
                title="Ver cotización"
                onPress={() => {
                  navigation.navigate("Pdfdetail", {
                    pdf: pdfCotizacion,
                    orden: cita.ordentrabajos[2],
                    cita: cita,
                  });
                }}
              />
              {cita.ordentrabajos[2].estado == "Pendiente" && (
                <View style={{ flexDirection: "column" }}>
                  <Input
                    labelStyle={styles.label}
                    inputStyle={styles.input}
                    placeholder="Comentario de aprobación o rechazo"
                    multiline={true}
                    onChangeText={(text) => setValue("comentario", text)}
                  />
                  {errors.comentario && (
                    <Text style={styles.inputError}>
                      {errors.comentario.message}
                    </Text>
                  )}
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Button
                      buttonStyle={styles.buttonPrimary}
                      titleStyle={styles.buttonText}
                      title="Aprobar"
                      onPress={handleSubmit(aprobarCotizacion)}
                    />
                    <Button
                      buttonStyle={styles.buttonPrimary}
                      titleStyle={styles.buttonText}
                      title="Rechazar"
                      onPress={handleSubmit(rechazarCotizacion)}
                    />
                  </View>
                </View>
              )}
            </Step>
          )}
          {cita.ordentrabajos.length > 3 && (
            <Step title="Aprobación">
              <Text style={styles.bodyText}>
                Fecha:{" "}
                <Text style={styles.bodyTextBold}>
                  {Moment(cita.ordentrabajos[3].createdAt).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </Text>
              </Text>
              <Text style={styles.bodyText}>
                Observaciones:{" "}
                <Text style={styles.bodyTextBold}>
                  {cita.ordentrabajos[3].Observaciones}
                </Text>
              </Text>
            </Step>
          )}
          {cita.ordentrabajos.length > 4 && (
            <Step title="Reparación">
              <Text style={styles.bodyText}>
                Fecha:{" "}
                <Text style={styles.bodyTextBold}>
                  {Moment(cita.ordentrabajos[4].createdAt).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </Text>
              </Text>
              <Text style={styles.bodyText}>
                Mecánico:{" "}
                <Text style={styles.bodyTextBold}>
                  {cita.ordentrabajos[4].mecanico.fullName}
                </Text>
              </Text>
              <GalleryList images={PhotosReparacion} itemsToRender={2} />
            </Step>
          )}
          {cita.ordentrabajos.length > 5 && (
            <Step title="Entrega">
              <Text style={styles.bodyText}>
                Fecha:{" "}
                <Text style={styles.bodyTextBold}>
                  {Moment(cita.ordentrabajos[5].createdAt).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </Text>
              </Text>
              <Text style={styles.bodyText}>
                Mecánico:{" "}
                <Text style={styles.bodyTextBold}>
                  {cita.ordentrabajos[5].mecanico.fullName}
                </Text>
              </Text>
              <Button
                buttonStyle={styles.buttonPrimary}
                titleStyle={styles.buttonText}
                title="Ver factura"
                onPress={() => {
                  navigation.navigate("Pdfdetail", {
                    pdf: pdfFactura,
                  });
                }}
              />
            </Step>
          )}
        </ReactSteps>
        {cita.estado == "Cumplida" && (
          <OpenChatButton cita={cita} navigation={navigation} />
        )}
      </View>
    </ScrollView>
  );
}

const Cita = (props: { cita: any }) => {
  const { cita } = props;
  //console.log("Navigation :::>", navigation);
  let fechaCita = Moment(cita.fechaCita.toString()).format("YYYY-MM-DD");
  let dateFecha = Moment(fechaCita + "T" + cita.horaCita);
  let fechaHora = Moment(dateFecha).format("hh:mm A");
  return (
    <View style={styles.cardMoto}>
      <View style={styles.cardMotoImageContainer}>
        <Image
          style={styles.cardMotoImage}
          source={require("./../../../assets/drawable-xxxhdpi/imageNoMoto.png")}
        />
      </View>
      <View>
        <Text style={styles.headingSecondary}>{cita.servicio}</Text>
        <Text style={styles.bodyText}>
          Taller: <Text style={styles.bodyTextBold}>{cita.taller.nombre}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Placa: <Text style={styles.bodyTextBold}>{cita.vehiculo.placa}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Estado: <Text style={styles.bodyTextBold}>{cita.estado}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Fecha: <Text style={styles.bodyTextBold}>{fechaCita}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Hora: <Text style={styles.bodyTextBold}>{fechaHora}</Text>
        </Text>
      </View>
    </View>
  );
};

interface OpenChatProps
  extends Pick<ActiveAppoinmentStackScreenProps<"Detail">, "navigation"> {
  cita: any;
}

function OpenChatButton(props: OpenChatProps) {
  const { cita, navigation } = props;
  const { IdTaller } = cita;
  return (
    <ActionButton
      buttonTextStyle={styles.actionButton}
      buttonColor="#0396c8"
      degrees={0}
      onPress={() => navigation.navigate("Chat", { IdTaller: IdTaller })}
      offsetY={70}
      offsetX={10}
      renderIcon={() => (
        <Icon type="material-community" name="chat-processing" />
      )}
    >
      {">"}
    </ActionButton>
  );
}
