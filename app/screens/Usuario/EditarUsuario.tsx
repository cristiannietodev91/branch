import React, { useEffect } from "react";
import { View, Image, SafeAreaView } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { useForm } from "react-hook-form";
import Snackbar from "react-native-snackbar";
import { URL_SERVICES } from "@env";
import styles from "../../styles/App.scss";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type FormData = {
  nombre: string;
  identificacion: string;
  celular: string;
};

export default function EditarUsuario(props: any) {
  const { navigation } = props;
  const { usuario, usuarioFacebook, setReloadData } = navigation.state.params;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  console.log("usuario facebook ::>", usuarioFacebook);

  useEffect(() => {
    register("nombre", {
      required: { value: true, message: "Campo requerido" },
    });
    register("identificacion", {
      required: { value: true, message: "Campo requerido" },
    });
    register("celular", {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^\+?[1-9]\d{9,14}$/,
        message: "Debe ingresar un numero de celular valido",
      },
    });

    setValue(
      "nombre",
      usuarioFacebook ? usuarioFacebook.displayName : usuario.firstName
    );
    setValue("identificacion", usuario.identificacion);
    setValue("celular", usuario.celular);
  }, [register, setValue, usuario, usuarioFacebook]);

  const updateUsuario = async (data: any) => {
    const usuarioUpdate = {
      email: usuario.email,
      identificacion: data.identificacion,
      celular: data.celular,
      firstName: data.nombre,
    };

    fetch(URL_SERVICES + "usuario/update/" + usuario.uid, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioUpdate),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (json.error) {
          Snackbar.show({
            text: json.error,
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          navigation.navigate("Usuario");
          Snackbar.show({
            text: "Se actualizo el usuario correctamente",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
        setReloadData(true);
      })
      .catch((error) => console.error(error));
  };

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <KeyboardAwareScrollView
        style={[styles.container, styles.userEditContainer]}
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
            Ahora puedes centralizar
          </Text>
          <Text style={[styles.headingSecondary, styles.centerText]}>
            toda la información de tus motos
          </Text>
        </View>
        <View style={[styles.containerAddPhoto, styles.regularMargin]}>
          <Image
            style={styles.userEditImage}
            source={require("./../../../assets/drawable-xxxhdpi/userEdit.png")}
          />
        </View>
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Email"
          placeholder="Email"
          editable={false}
          defaultValue={usuario.email}
        />
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Nombre Completo"
          placeholder="Nombre Completo"
          defaultValue={
            usuarioFacebook
              ? usuarioFacebook.displayName
              : usuario.firstName + ""
          }
          onChangeText={(text) => setValue("nombre", text)}
        />
        {errors.nombre && (
          <Text style={styles.inputError}>{errors.nombre.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Documento"
          placeholder="Documento"
          defaultValue={usuario.identificacion}
          onChangeText={(text) => setValue("identificacion", text)}
        />
        {errors.identificacion && (
          <Text style={styles.inputError}>{errors.identificacion.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Celular"
          placeholder="Celular"
          defaultValue={usuario.celular}
          onChangeText={(text) => setValue("celular", text)}
        />
        {errors.celular && (
          <Text style={styles.inputError}>{errors.celular.message}</Text>
        )}
        <Button
          title="Editar"
          onPress={handleSubmit(updateUsuario)}
          buttonStyle={styles.buttonPrimary}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Cancelar"
          onPress={() => {
            navigation.navigate("Usuario");
          }}
          buttonStyle={[styles.buttonSecondary, { marginBottom: 120 }]}
          titleStyle={styles.buttonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
