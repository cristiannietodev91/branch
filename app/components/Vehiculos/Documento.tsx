import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Text, Image } from "@rneui/themed";
import Moment from "moment";
import { launchImageLibrary } from "react-native-image-picker";
import { URL_SERVICES } from "@env";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/App.scss";
import ButtonBranch from "../../components/branch/button";

export default function Documento(props: any) {
  const { titleDocumento, tipoDocumento, documento, setIsReloadData } = props;
  let { vehiculo } = props;

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showDocument, setShowDocument] = useState(documento);
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  useEffect(() => {
    switch (tipoDocumento) {
      case "soat":
        setFechaVencimiento(
          vehiculo.fvsoat
            ? Moment(vehiculo.fvsoat).format("DD/MM/YYYY")
            : "Sin fecha de vencimiento"
        );
        break;
      case "tecnomecanica":
        setFechaVencimiento(
          vehiculo.fvtecnomecanica
            ? Moment(vehiculo.fvtecnomecanica).format("DD/MM/YYYY")
            : "Sin fecha de vencimiento"
        );
        break;
    }
  }, [tipoDocumento, vehiculo]);

  const uploadImage = async () => {
    const options = {
      mediaType: "photo" as const,
      quality: 1 as const,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const { uri, fileName, fileSize, type } = response;

        fetch(URL_SERVICES + "file/signedURL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((url) => {
            console.log("Url to load :::>", url);
            fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": type,
              },
              body: {
                uri: uri,
                type: type,
                name: fileName,
              },
            })
              .then((response: any) => {
                console.log("Response :::>", response);
                let url: string = response.url.substring(
                  0,
                  response.url.indexOf("?")
                );
                let key = url.substring(url.lastIndexOf("/") + 1, url.length);

                let newDocumento = {
                  url: response.url.substring(0, response.url.indexOf("?")),
                  date: new Date().toString(),
                  size: fileSize,
                  type: type,
                  selected: false,
                  validate: false,
                  keynameFile: key,
                  nombreArchivo: fileName,
                };

                setShowDocument(newDocumento);

                switch (tipoDocumento) {
                  case "soat":
                    vehiculo.soat = newDocumento;
                    break;
                  case "tecnomecanica":
                    vehiculo.tecnomecanica = newDocumento;
                    break;
                }

                fetch(URL_SERVICES + "vehiculo/update/" + vehiculo.IdVehiculo, {
                  method: "PUT",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(vehiculo),
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then(() => {
                    setIsReloadData(true);
                  })
                  .catch((error) => console.error(error));
              })
              .catch((error: any) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    });
  };

  const uploadFechaVencimiento = (fechaVencimiento: Date) => {
    let vehiculoToUpdate = {
      fvsoat: vehiculo.fvsoat,
      fvtecnomecanica: vehiculo.fvtecnomecanica,
    };

    console.log("Fecha vencimiento::>", fechaVencimiento);

    let fechaVence = Moment(fechaVencimiento).format("DD/MM/YYYY");

    switch (tipoDocumento) {
      case "soat":
        vehiculoToUpdate.fvsoat = fechaVence;
        break;
      case "tecnomecanica":
        vehiculoToUpdate.fvtecnomecanica = fechaVence;
        break;
    }

    fetch(
      URL_SERVICES + "vehiculo/updateFechavencimiento/" + vehiculo.IdVehiculo,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehiculoToUpdate),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(() => {
        setFechaVencimiento(fechaVence);
        setIsReloadData(true);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.cardDoc}>
      {!showDocument ? (
        <TouchableOpacity
          onPress={uploadImage}
          style={[styles.cardDocImageContainer, { alignItems: "center" }]}
        >
          <Image
            style={styles.cardMotoImage}
            source={require("./../../../assets/drawable-xxxhdpi/imageNoMoto.png")}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.cardDocImageContainer}>
          <Image
            style={styles.cardDocImage}
            source={
              showDocument
                ? { uri: showDocument.url }
                : require("../../../assets/profile.jpg")
            }
          />
        </View>
      )}
      <View style={styles.cardDocInfoContainer}>
        <View style={styles.cardDocInfo}>
          <Text style={styles.headingSecondary}>{titleDocumento}</Text>
          <Text style={styles.bodyText}>Vence {fechaVencimiento}</Text>
        </View>
        <ButtonBranch iconName="file-upload-outline" onPress={uploadImage} />
        <ButtonBranch
          iconName="circle-edit-outline"
          onPress={() => {
            setShowCalendar(true);
          }}
        />
        <ButtonBranch
          iconName="arrow-right"
          // onPress={uploadImage}
        />
        {showCalendar && (
          <DateTimePicker
            testID="datePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            locale="es-ES"
            onChange={(event, selectedDate) => {
              setShowCalendar(Platform.OS === "ios" ? true : false);

              uploadFechaVencimiento(selectedDate!);
            }}
            minimumDate={new Date()}
          />
        )}
      </View>
    </View>
  );
}
