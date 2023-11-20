import React, { useState, useEffect } from "react";
import styles from "../../styles/App.scss";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Text,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Input, Button, Image } from "@rneui/base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-material-dropdown-v2";
import { URL_SERVICES } from "@env";
import { useForm } from "react-hook-form";
import { years } from "../../../data/data";
import { launchImageLibrary } from "react-native-image-picker";
import Snackbar from "react-native-snackbar";
import Moment from "moment";
import { VehiclesStackScreenProps } from "../../../types/types";

export default function EditVehicle(props: VehiclesStackScreenProps<"Edit">) {
  const { navigation, route } = props;
  const { vehicle } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [fechaCompra, setFechaCompra] = useState(
    vehicle.fechaCompra
      ? Moment(vehicle.fechaCompra, "YYYY-MM-DD").toDate()
      : new Date()
  );
  const [referencias, setReferencias] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      kilometraje: vehicle.kilometraje,
      alias: vehicle.alias ? vehicle.alias : "",
      modelo: vehicle.modelo,
      fechacompra: vehicle.fechaCompra ? vehicle.fechaCompra : null,
      marca: vehicle.marca ? vehicle.marca.marca : null,
      referencia: vehicle.marca ? vehicle.marca.referencia : null,
      color: vehicle.color ? vehicle.color : null,
    },
  });
  const [referencia, setReferencia] = useState(
    vehicle.marca ? vehicle.marca.referencia : ""
  );
  const [marca, setMarca] = useState("");
  const [urlFoto, setUrlFoto] = useState<string | null>();

  useEffect(() => {
    fetch(URL_SERVICES + "marca/getAllUnique")
      .then((response) => response.json())
      .then((json) => {
        //console.log("Respuesta motos ::>", json);
        setMarcas(json);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [isLoading]);

  useEffect(() => {
    register("kilometraje", {
      required: { value: true, message: "Kilometraje requerido" },
      pattern: {
        value: /^[0-9]*$/,
        message: "Debe ingresar un valor valido",
      },
      validate: {
        positive: (value) => value > 0,
      },
    });
    register("alias", {
      required: { value: true, message: "Alias es requerido" },
    });
    register("color", {
      required: { value: true, message: "Campo requerido" },
    });
    register("modelo", {
      required: { value: true, message: "Campo requerido" },
    });
    register("marca", {
      required: { value: true, message: "Campo requerido" },
    });
    register("referencia", {
      required: { value: true, message: "Campo requerido" },
    });
    register("fechacompra", {
      required: { value: true, message: "Campo requerido" },
    });
  }, [register]);

  //console.log("Vehiculo ::::>", vehiculo.kilometraje);

  const updateVehiculo = async (data: any) => {
    //console.log("User logged");
    console.log("Data to send :::>", data);
    let vehiculoToUdp = {
      alias: data.alias,
      kilometraje: data.kilometraje,
      marca: {
        marca: data.marca,
        referencia: data.referencia,
      },
      usuarios: vehicle.usuario,
      tipoVehiculo: vehicle.tipoVehiculo,
      fotos: urlFoto ? [urlFoto] : [],
      color: data.color,
      fechaCompra: data.fechacompra,
      modelo: data.modelo,
    };
    fetch(URL_SERVICES + "vehiculo/update/" + vehicle.IdVehiculo, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehiculoToUdp),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((err) => Promise.reject(err));
        }
      })
      .then((json) => {
        console.log("Respuesta de actualizar la moto ::>", json);
        navigation.navigate("Main");
      })
      .catch((error) => {
        if (error.message) {
          Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      });
  };

  const loadReferencias = (marca: string) => {
    fetch(URL_SERVICES + "marca/getAllByMarca/" + marca)
      .then((response) => response.json())
      .then((json) => {
        //console.log("Respuesta motos ::>", json);
        setReferencias(json);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const uploadImage = async () => {
    const options = {
      mediaType: "photo" as const,
      quality: 1 as const,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets) {
        const { uri, fileName, type } = response.assets[0];

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
            response.json().then((url) => {
              fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": type || "",
                },
                body: {
                  uri: uri || "",
                  type: type,
                  name: fileName,
                },
              })
                .then(() => {
                  /*let url: string = response.url.substring(
                    0,
                    response.url.indexOf("?")
                  );
                  let key = url.substring(url.lastIndexOf("/") + 1, url.length);
                  setUrlFoto({
                    url: response.url.substring(0, response.url.indexOf("?")),
                    date: new Date().toString(),
                    size: fileSize,
                    type: type,
                    selected: false,
                    validate: false,
                    keynameFile: key,
                    nombreArchivo: fileName,
                  });*/
                })
                .catch((error) => console.error(error));
            });
          })
          .catch((error) => console.error(error));
      }
    });
  };

  //Set Url Foto
  useEffect(() => {
    let photoURL = !(
      vehicle.fotos &&
      vehicle.fotos[0] &&
      vehicle.fotos.length > 0
    )
      ? null
      : vehicle.fotos[0].url;
    setUrlFoto(photoURL);
  }, [vehicle]);

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <KeyboardAwareScrollView>
        <View>
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            Cambia o actualiza los datos de moto
          </Text>
        </View>
        <View style={[styles.containerAddPhoto, styles.regularMargin]}>
          <TouchableOpacity onPress={uploadImage}>
            {!urlFoto ? (
              <Image
                style={styles.addPhoto}
                source={require("./../../../assets/drawable-xxxhdpi/addPhotoMoto.png")}
              />
            ) : (
              <View style={[styles.addPhoto, styles.photo]}>
                <Image style={styles.addPhoto} source={{ uri: urlFoto }} />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Kilometraje"
          placeholder="Kilometraje"
          textContentType="telephoneNumber"
          onChangeText={(text) => setValue("kilometraje", parseInt(text, 10))}
          keyboardType="number-pad"
          defaultValue={vehicle.kilometraje ? vehicle.kilometraje + "" : ""}
        />
        {errors.kilometraje && (
          <Text style={styles.inputError}>{errors.kilometraje.message}</Text>
        )}

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Color"
          placeholder="Color"
          defaultValue={vehicle.color}
          containerStyle={styles.inputContainer}
          keyboardType="ascii-capable"
          onChangeText={(text) => setValue("color", text)}
        />
        {errors.color && (
          <Text style={styles.inputError}>{errors.color.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Nombre"
          placeholder="Nombre de tu moto"
          defaultValue={vehicle.alias}
          containerStyle={styles.inputContainer}
          onChangeText={(text) => setValue("alias", text)}
        />
        {errors.alias && (
          <Text style={styles.inputError}>{errors.alias.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Placa"
          placeholder="Placa"
          editable={false}
          keyboardType="number-pad"
          value={vehicle.placa}
          containerStyle={styles.inputContainer}
        />

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Fecha compra"
          placeholder="Fecha compra"
          editable={vehicle.fechaCompra === null}
          containerStyle={styles.inputContainer}
          onFocus={() => {
            if (vehicle.fechaCompra === null) {
              setShowCalendar(true);
            }
          }}
          value={fechaCompra ? Moment(fechaCompra).format("DD/MM/YYYY") : ""}
        />
        {errors.fechacompra && (
          <Text style={styles.inputError}>{errors.fechacompra.message}</Text>
        )}

        {showCalendar && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={fechaCompra}
            mode="date"
            is24Hour={true}
            display="default"
            locale="es-ES"
            onChange={(event, selectedDate) => {
              setShowCalendar(Platform.OS === "ios" ? true : false);
              if (selectedDate) {
                setValue(
                  "fechacompra",
                  Moment(selectedDate).format("DD/MM/YYYY")
                );
                setFechaCompra(selectedDate);
              }
            }}
          />
        )}

        <Dropdown
          textColor="#0396c8"
          containerStyle={[styles.input, styles.dropdown]}
          label="Marca "
          labelExtractor={(label: any) => {
            return label.marca;
          }}
          valueExtractor={(value: any) => {
            return value.marca;
          }}
          value={vehicle.marca.marca}
          data={vehicle.marca.IdMarca !== 1 ? new Array(vehicle.marca) : marcas}
          onChangeText={(text: any) => {
            if (marca !== text) {
              setValue("marca", text);
              setMarca(text);
              setReferencia("");
              loadReferencias(text);
            }
          }}
          disabled={vehicle.marca.IdMarca !== 1 ? true : false}
        />
        {errors.marca && (
          <Text style={styles.inputError}>{errors.marca.message}</Text>
        )}
        <Dropdown
          textColor="#0396c8"
          containerStyle={[styles.input, styles.dropdown]}
          label="Referencia "
          labelExtractor={(label: any) => {
            return label.referencia;
          }}
          valueExtractor={(value: any) => {
            //console.log("Indexx :::>", index, "Value ::>", value);
            return value.referencia;
          }}
          value={referencia}
          data={
            vehicle.marca.IdMarca !== 1 ? new Array(vehicle.marca) : referencias
          }
          onChangeText={(text: any) => {
            setValue("referencia", text);
            setReferencia(text);
          }}
          disabled={vehicle.marca.IdMarca !== 1 ? true : false}
        />
        {errors.referencia && (
          <Text style={styles.inputError}>{errors.referencia.message}</Text>
        )}
        <Dropdown
          textColor="#0396c8"
          containerStyle={[styles.input, styles.dropdown]}
          label="Modelo "
          value={vehicle.modelo ? vehicle.modelo + "" : ""}
          data={years}
          disabled={vehicle.modelo ? true : false}
          onChangeText={(text: any) => {
            setValue("modelo", text);
          }}
        />
        {errors.modelo && (
          <Text style={styles.inputError}>{errors.modelo.message}</Text>
        )}
        <Button
          title="Guardar"
          onPress={handleSubmit(updateVehiculo)}
          buttonStyle={styles.buttonPrimary}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Cancelar"
          onPress={() => {
            navigation.goBack();
          }}
          buttonStyle={styles.buttonSecondary}
          titleStyle={styles.buttonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
