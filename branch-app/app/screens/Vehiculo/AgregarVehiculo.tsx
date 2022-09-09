import React, { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Input, Button, Image } from "@rneui/base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from "react-native-image-picker";
import Moment from "moment";
import auth from "@react-native-firebase/auth";
import { Dropdown } from "react-native-material-dropdown-v2";
import { URL_SERVICES } from "@env";
import { useForm } from "react-hook-form";
import Snackbar from "react-native-snackbar";
import { years } from "../../../data/data";
import { VehiclesStackScreenProps } from "../../../types/types";
import styles from "../../styles/App.scss";

type FormData = {
  marca: string;
  referencia: string;
  kilometraje: string;
  placa: string;
  color: string;
  modelo: string;
  fechacompra?: Date;
  alias: string;
};

export default function AgregarVehiculo(
  props: VehiclesStackScreenProps<"Add">
) {
  const { navigation } = props;
  const [isLoading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [referencias, setReferencias] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [fechaCompra, setFechaCompra] = useState(new Date(1598051730000));
  const [referencia, setReferencia] = useState("");
  const [marca, setMarca] = useState("");
  const [urlFoto] = useState();

  const user = auth().currentUser;

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
    register("marca", {
      required: { value: true, message: "Campo requerido" },
    });
    register("referencia", {
      required: { value: true, message: "Campo requerido" },
    });
    register("kilometraje", {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^[0-9]*$/,
        message: "Debe ingresar un valor valido",
      },
      validate: {
        positive: (value) => parseInt(value) > 0,
      },
    });
    register("placa", {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^[a-zA-Z]{3}[0-9]{2}[a-zA-Z0-9]$/,
        message: "La placa debe tener el formato AAA999 ó AAA99A",
      },
    });
    register("color", {
      required: { value: true, message: "Campo requerido" },
    });
    register("modelo", {
      required: { value: true, message: "Campo requerido" },
    });
    register("fechacompra", {
      required: { value: true, message: "Campo requerido" },
    });
    register("alias", {
      required: { value: true, message: "Campo requerido" },
    });
  }, [register]);

  //console.log("Vehiculo ::::>", vehiculo.kilometraje);

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

  const createVehiculo = async (data: any) => {
    //console.log("User logged");

    let vehiculoCreate = {
      placa: data.placa.toUpperCase(),
      alias: data.alias,
      color: data.color,
      fechaCompra: Moment(data.fechacompra).format("DD/MM/YYYY"),
      kilometraje: data.kilometraje,
      marca: {
        marca: data.marca,
        referencia: data.referencia,
      },
      modelo: data.modelo,
      usuarios: {
        email: user?.email,
        uid: user?.uid,
      },
      tipoVehiculo: "Moto",
      fotos: urlFoto ? [urlFoto] : [],
    };

    console.log("Vehiculo to create :::>", vehiculoCreate);

    fetch(URL_SERVICES + "vehiculo/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehiculoCreate),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((err) => Promise.reject(err));
        }
      })
      .then((json) => {
        console.log("Respuesta de crear el vehiculo ::>", json);
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

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        extraScrollHeight={150}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            Agrega todas tus motos para tener
          </Text>
          <Text style={[styles.headingSecondary, styles.centerText]}>
            todo en el mismo lugar{" "}
          </Text>
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            Para empezar puedes subir una foto de tu moto y llena estos datos
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
          data={marcas || []}
          onChangeText={(text: any) => {
            if (marca !== text) {
              setValue("marca", text);
              setMarca(text);
              setReferencia("");
              loadReferencias(text);
            }
          }}
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
          data={referencias || []}
          onChangeText={(text: any) => {
            setValue("referencia", text);
            setReferencia(text);
          }}
          value={referencia}
        />
        {errors.referencia && (
          <Text style={styles.inputError}>{errors.referencia.message}</Text>
        )}
        <Dropdown
          textColor="#0396c8"
          containerStyle={[styles.input, styles.dropdown]}
          label="Modelo"
          data={years || []}
          onChangeText={(text: any) => {
            setValue("modelo", text);
          }}
        />
        {errors.modelo && (
          <Text style={styles.inputError}>{errors.modelo.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Kilometraje"
          placeholder="Kilometraje"
          textContentType="telephoneNumber"
          onChangeText={(text) => setValue("kilometraje", text)}
          keyboardType="number-pad"
        />
        {errors.kilometraje && (
          <Text style={styles.inputError}>{errors.kilometraje.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Placa"
          placeholder="Placa"
          keyboardType="email-address"
          onChangeText={(text) => setValue("placa", text.toUpperCase())}
        />
        {errors.placa && (
          <Text style={styles.inputError}>{errors.placa.message}</Text>
        )}

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Color"
          placeholder="Color"
          keyboardType="ascii-capable"
          onChangeText={(text) => setValue("color", text)}
        />
        {errors.color && (
          <Text style={styles.inputError}>{errors.color.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Fecha compra"
          placeholder="Fecha compra"
          keyboardType="ascii-capable"
          onFocus={() => {
            setShowCalendar(true);
          }}
          value={Moment(fechaCompra).format("DD/MM/YYYY")}
        />
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
        {errors.fechacompra && (
          <Text style={styles.inputError}>{errors.fechacompra.message}</Text>
        )}

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Nombre de tu moto"
          placeholder="Sabemos que todos le ponemos nombre..."
          containerStyle={styles.inputContainer}
          onChangeText={(text) => setValue("alias", text)}
        />
        {errors.alias && (
          <Text style={styles.inputError}>{errors.alias.message}</Text>
        )}
        <Button
          title="Crear moto"
          onPress={handleSubmit(createVehiculo)}
          buttonStyle={styles.buttonPrimary}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Cancelar"
          onPress={() => {
            navigation.navigate("Main");
            // console.log(navigation.navigate("Vehiculo"))
          }}
          buttonStyle={styles.buttonSecondary}
          titleStyle={styles.buttonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
