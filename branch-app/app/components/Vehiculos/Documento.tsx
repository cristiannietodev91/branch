import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Text, Image } from "@rneui/themed";
import Moment from "moment";
import { launchImageLibrary } from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/App.scss";
import ButtonBranch from "../../components/branch/button";
import { Vehicle, VehiclesStackScreenProps } from "../../../types/types";
import useMutation from "../../hooks/useMutation";

interface DocumentProps
  extends Pick<VehiclesStackScreenProps<"Documents">, "navigation"> {
  vehiculo: Vehicle;
  titleDocumento: string;
  tipoDocumento: string;
  documento: any;
}

export default function Documento(props: DocumentProps) {
  const { titleDocumento, tipoDocumento, documento } = props;
  let { vehiculo } = props;

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showDocument, setShowDocument] = useState(documento);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const { mutate: updateVehicle } = useMutation(
    `vehiculo/update/${vehiculo.IdVehiculo}`,
    {},
    "PUT"
  );
  const { mutate: updateFechaVencimiento } = useMutation<string>(
    `vehiculo/updateFechavencimiento/${vehiculo.IdVehiculo}`,
    {},
    "PUT"
  );

  const { mutate: signFile } = useMutation<string>("file/signedURL");
  const { mutate: putFile, setUrl: setUrlToPutFile } = useMutation<{
    url: string;
  }>(undefined, undefined, "PUT");

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

    launchImageLibrary(options, async (response: any) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const { uri, fileName, fileSize, type } = response;

        const { isSuccess, data: url } = await signFile({ fileName: fileName });

        if (isSuccess && url && type && uri) {
          setUrlToPutFile(url);

          const { isSuccess: isSuccessSendingFile, data } = await putFile({
            uri: uri,
            type: type,
            name: fileName,
          });

          if (isSuccessSendingFile && data) {
            let urlFile: string = data.url.substring(0, data.url.indexOf("?"));

            let key = urlFile.substring(
              urlFile.lastIndexOf("/") + 1,
              urlFile.length
            );

            const newDocumento = {
              url: urlFile,
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

            await updateVehicle(vehiculo);
          }
        }
      }
    });
  };

  const uploadFechaVencimiento = async (fechaVencimiento: Date) => {
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

    const { isSuccess, data: resultUpdate } = await updateFechaVencimiento(
      vehiculoToUpdate
    );

    if (isSuccess && resultUpdate) {
      setFechaVencimiento(resultUpdate);
    }
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
        {/* <ButtonBranch
          iconName="arrow-right"
          // onPress={uploadImage}
        /> */}
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
