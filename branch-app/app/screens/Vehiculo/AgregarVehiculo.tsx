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
import { useForm } from "react-hook-form";
import Snackbar from "react-native-snackbar";
import { years } from "../../../data/data";
import {
  ListBrand,
  Vehicle,
  VehiclesStackScreenProps,
} from "../../../types/types";
import styles from "../../styles/App.scss";
import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [fechaCompra, setFechaCompra] = useState(new Date());
  const [referencia, setReferencia] = useState("");
  const [marca, setMarca] = useState<string>("");
  const [urlFoto] = useState();
  const { mutate: createVehicle } = useMutation<Vehicle>("vehiculo/create");
  const { mutate: signFile } = useMutation<string>("file/signedURL");
  const { mutate: putFile, setUrl: setUrlToPutFile } = useMutation<{
    url: string;
  }>(undefined, undefined, "PUT");

  const { data: marcas, getData: getBrands } =
    useFetch<ListBrand>("marca/getAllUnique");

  const { data: referencias, getData: getReferences } = useFetch<ListBrand>(
    `marca/getAllByMarca/${marca}`
  );

  const user = auth().currentUser;

  useEffect(() => {
    getBrands();
  }, [getBrands]);

  useEffect(() => {
    if (marca !== null && marca.trim() !== "") {
      getReferences();
    }
  }, [getReferences, marca]);

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

  const uploadImage = async () => {
    const options = {
      mediaType: "photo" as const,
      quality: 1 as const,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets) {
        const { uri, fileName, type } = response.assets[0];

        const { isSuccess, data: url } = await signFile({ fileName: fileName });

        if (isSuccess && url && type && uri) {
          setUrlToPutFile(url);

          await putFile({
            uri: uri,
            type: type,
            name: fileName,
          });
        }
      }
    });
  };

  const createVehiculo = async (data: any) => {
    const vehicleToCreate = {
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
      usuario: {
        email: user?.email,
        uid: user?.uid,
      },
      tipoVehiculo: "Moto",
      fotos: urlFoto ? [urlFoto] : [],
    };

    const { isSuccess, error } = await createVehicle(vehicleToCreate);
    if (isSuccess) {
      navigation.navigate("Main");
    }

    if (error) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
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
            value={fechaCompra}
            mode="date"
            is24Hour={true}
            display="default"
            locale="es-ES"
            onChange={(event, selectedDate) => {
              setShowCalendar(Platform.OS === "ios" ? true : false);
              if (selectedDate) {
                setValue("fechacompra", selectedDate);
                setFechaCompra(selectedDate);
              }
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
