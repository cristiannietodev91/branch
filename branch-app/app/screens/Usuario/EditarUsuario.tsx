import React, { useEffect } from "react";
import { View, Image, SafeAreaView } from "react-native";
import { Input, Button, Text } from "@rneui/base";
import { useForm } from "react-hook-form";
import Snackbar from "react-native-snackbar";
import styles from "../../styles/App.scss";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useMutation from "../../hooks/useMutation";
import { UserStackScreenProps } from "../../../types/types";
import auth from "@react-native-firebase/auth";

type FormData = {
  nombre: string;
  identificacion: string;
  celular: string;
};

export default function EditarUsuario(props: UserStackScreenProps<"Edit">) {
  const { navigation, route } = props;
  const { usuario, usuarioFacebook } = route.params;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate: updateUser } = useMutation(
    `usuario/update/${usuario?.uid}`,
    {},
    "PUT"
  );

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

    const userName = () => {
      if (usuarioFacebook && usuarioFacebook.displayName) {
        return usuarioFacebook.displayName;
      }

      if (usuario && usuario.firstName) {
        return usuario.firstName;
      }

      return "";
    };

    setValue("nombre", userName());
    setValue("identificacion", usuario.identificacion);
    setValue("celular", usuario.celular);
  }, [register, setValue, usuario, usuarioFacebook]);

  const updateUsuario = async (data: FormData) => {
    const usuarioUpdate = {
      email: usuario.email,
      identificacion: data.identificacion,
      celular: data.celular,
      firstName: data.nombre,
    };

    const { isSuccess, error } = await updateUser(usuarioUpdate);

    if (isSuccess) {
      let userLogged = auth().currentUser;
      if (userLogged) {
        await userLogged?.reload();
        navigation.goBack();
        Snackbar.show({
          text: "Se actualizo el usuario correctamente",
          duration: Snackbar.LENGTH_SHORT,
        });
        return;
      }
    }

    if (error) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
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
            navigation.goBack();
          }}
          buttonStyle={[styles.buttonSecondary, { marginBottom: 120 }]}
          titleStyle={styles.buttonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
