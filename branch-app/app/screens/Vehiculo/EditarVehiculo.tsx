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

export default function EditarVehiculo(
  props: VehiclesStackScreenProps<"Edit">
) {
  const { navigation, route } = props;
  const { vehiculo } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [fechaCompra, setFechaCompra] = useState(
    vehiculo.fechaCompra ? vehiculo.fechaCompra : null
  );
  const [referencias, setReferencias] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      kilometraje: vehiculo.kilometraje ? vehiculo.kilometraje : "",
      alias: vehiculo.alias ? vehiculo.alias : "",
      modelo: vehiculo.modelo,
      fechacompra: vehiculo.fechaCompra ? vehiculo.fechaCompra : null,
      marca: vehiculo.marca ? vehiculo.marca.marca : null,
      referencia: vehiculo.marca ? vehiculo.marca.referencia : null,
      color: vehiculo.color ? vehiculo.color : null,
    },
  });
  const [referencia, setReferencia] = useState(
    vehiculo.marca ? vehiculo.marca.referencia : ""
  );
  const [marca, setMarca] = useState("");
  const [urlFoto, setUrlFoto] = useState();

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
        positive: (value) => parseInt(value) > 0,
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
      usuarios: vehiculo.usuario,
      tipoVehiculo: vehiculo.tipoVehiculo,
      fotos: urlFoto ? [urlFoto] : [],
      color: data.color,
      fechacompra: data.fechacompra,
      fechaCompraText: Moment(data.fechacompra).format("d/MM/YYYY"),
      modelo: data.modelo,
    };
    fetch(URL_SERVICES + "vehiculo/update/" + vehiculo.IdVehiculo, {
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
    let MyurlFoto = !(
      vehiculo.fotos &&
      vehiculo.fotos[0] &&
      vehiculo.fotos.length > 0
    )
      ? null
      : vehiculo.fotos[0].url;
    setUrlFoto(MyurlFoto ? { url: MyurlFoto } : MyurlFoto);
  }, [vehiculo]);

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
          onChangeText={(text) => setValue("kilometraje", text)}
          keyboardType="number-pad"
          defaultValue={vehiculo.kilometraje ? vehiculo.kilometraje + "" : ""}
        />
        {errors.kilometraje && (
          <Text style={styles.inputError}>{errors.kilometraje.message}</Text>
        )}

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Color"
          placeholder="Color"
          defaultValue={vehiculo.color}
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
          defaultValue={vehiculo.alias}
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
          value={vehiculo.placa}
          containerStyle={styles.inputContainer}
          disabled={true}
        />

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Fecha compra"
          placeholder="Fecha compra"
          editable={vehiculo.fechaCompra ? false : true}
          containerStyle={styles.inputContainer}
          disabled={vehiculo.fechaCompra ? true : false}
          onFocus={() => {
            setShowCalendar(true);
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
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            locale="es-ES"
            onChange={(event, selectedDate) => {
              setShowCalendar(Platform.OS === "ios" ? true : false);
              setValue("fechacompra", selectedDate);
              setFechaCompra(selectedDate!);
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
          value={vehiculo.marca.marca}
          data={
            vehiculo.marca.IdMarca !== 1 ? new Array(vehiculo.marca) : marcas
          }
          onChangeText={(text: any) => {
            if (marca !== text) {
              setValue("marca", text);
              setMarca(text);
              setReferencia("");
              loadReferencias(text);
            }
          }}
          disabled={vehiculo.marca.IdMarca !== 1 ? true : false}
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
            vehiculo.marca.IdMarca !== 1
              ? new Array(vehiculo.marca)
              : referencias
          }
          onChangeText={(text: any) => {
            setValue("referencia", text);
            setReferencia(text);
          }}
          disabled={vehiculo.marca.IdMarca !== 1 ? true : false}
        />
        {errors.referencia && (
          <Text style={styles.inputError}>{errors.referencia.message}</Text>
        )}
        <Dropdown
          textColor="#0396c8"
          containerStyle={[styles.input, styles.dropdown]}
          label="Modelo "
          value={vehiculo.modelo ? vehiculo.modelo + "" : ""}
          data={years}
          disabled={vehiculo.modelo ? true : false}
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
            navigation.navigate("Vehiculo");
          }}
          buttonStyle={styles.buttonSecondary}
          titleStyle={styles.buttonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
