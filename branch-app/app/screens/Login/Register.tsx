import React, { useEffect, useState } from "react";
import styles from "../../styles/App.scss";
import { View, Text, SafeAreaView } from "react-native";
import { useForm } from "react-hook-form";
import { Input, Button, Image, Icon } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import Snackbar from "react-native-snackbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import useMutation from "../../hooks/useMutation";

type FormData = {
  email: string;
  password: string;
  nombre: string;
  identificacion: string;
  celular: string;
};

export default function Register() {
  const navigation = useNavigation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [, setUser] = useState();
  const [togglePassword, passwordState] = useState(true);
  const { mutate: createUser } = useMutation("usuario/createFireBaseUser");

  // Handle user state changes
  async function onAuthStateChanged(user: any) {
    console.log("user :::>", user);
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    register("email", {
      required: { value: true, message: "Email requerido" },
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message: "El valor ingresado no es un email",
      },
    });
    register("password", {
      required: { value: true, message: "Password requerido" },
      minLength: { value: 6, message: "La longitud debe ser mayor a 6" },
    });
    register("nombre", {
      required: { value: true, message: "Campo requerido" },
    });
    register("identificacion", {
      required: { value: true, message: "Campo requerido" },
    });
    register("celular", {
      required: { value: true, message: "Campo requerido" },
      minLength: { value: 10, message: "La longitud debe ser de 10" },
      maxLength: { value: 10, message: "La longitud debe ser de 10" },
    });
  }, [register]);

  const registrarUsuario = async (data: any) => {
    let usuarioToCreate = {
      firstName: data.nombre,
      email: data.email,
      celular: data.celular,
      identificacion: data.identificacion,
      tipoUsuario: "Cliente",
      password: data.password,
    };

    const { isSuccess, error: errorCreatingUser } = await createUser(
      usuarioToCreate
    );

    if (isSuccess) {
      try {
        await auth().signInWithEmailAndPassword(data.email, data.password);
      } catch (error: any) {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          Snackbar.show({
            text: "Wrong Password",
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: "Ocurrio un error al actualizar el usario",
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      }
    }

    if (errorCreatingUser) {
      Snackbar.show({
        text: errorCreatingUser.message,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  return (
    <SafeAreaView style={styles.registerContainer}>
      <KeyboardAwareScrollView
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
        <View>
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            Para empezar rellena estos datos.
          </Text>
        </View>
        <Input
          label="Email"
          placeholder="Email"
          labelStyle={styles.label}
          inputStyle={styles.input}
          onChangeText={(text) => setValue("email", text)}
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        {errors.email && (
          <Text style={styles.inputError}>{errors.email.message}</Text>
        )}
        <Input
          label="Contraseña"
          placeholder="Contraseña"
          textContentType="password"
          labelStyle={styles.label}
          inputStyle={styles.input}
          onChangeText={(text) => setValue("password", text)}
          secureTextEntry={togglePassword}
          rightIcon={
            <Icon
              onPress={() => {
                passwordState(!togglePassword);
              }}
              name={togglePassword ? "eye-outline" : "eye-off-outline"}
              color="#00aced"
              type="material-community"
            />
          }
        />
        {errors.password && (
          <Text style={styles.inputError}>{errors.password.message}</Text>
        )}
        <Input
          label="Nombre Completo"
          placeholder="Nombre Completo"
          onChangeText={(text) => setValue("nombre", text)}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        {errors.nombre && (
          <Text style={styles.inputError}>{errors.nombre.message}</Text>
        )}
        <Input
          label="Documento"
          placeholder="Documento"
          onChangeText={(text) => setValue("identificacion", text)}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        {errors.identificacion && (
          <Text style={styles.inputError}>{errors.identificacion.message}</Text>
        )}
        <Input
          label="Celular"
          placeholder="Celular"
          onChangeText={(text) => setValue("celular", text)}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        {errors.celular && (
          <Text style={styles.inputError}>{errors.celular.message}</Text>
        )}
        <Button
          title="Registrarme"
          onPress={handleSubmit(registrarUsuario)}
          buttonStyle={styles.buttonPrimary}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Cancelar"
          onPress={() => {
            navigation.navigate("MainLogin");
          }}
          buttonStyle={styles.buttonSecondary}
          titleStyle={styles.buttonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
