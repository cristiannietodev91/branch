import React, { useEffect, useState, useContext } from "react";
import styles from "../../styles/App.scss";
import { View, Image, Text, SafeAreaView } from "react-native";
import { Button, Icon, Input } from "@rneui/base";
import Snackbar from "react-native-snackbar";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [togglePassword, passwordState] = useState(true);

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
      min: { value: 6, message: "La longitud debe ser mayor a 6" },
    });
  }, [register]);

  const login = async (data: FormData) => {
    try {
      const { email, password } = data;

      await signIn(email, password);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        Snackbar.show({
          text: "Password Incorrecto",
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        if (errorCode === "auth/user-not-found") {
          Snackbar.show({
            text: "Usuario no existe, Registrese",
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          console.log("Error message :::>", errorMessage);
          Snackbar.show({
            text: "Error al autenticar el usuario",
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
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
          label="Correo electronico"
          placeholder="Correo electronico"
          textContentType="emailAddress"
          labelStyle={styles.label}
          inputStyle={styles.input}
          onChangeText={(text) => setValue("email", text)}
          keyboardType="email-address"
        />
        {errors.email && (
          <Text style={styles.inputError}>{errors.email.message}</Text>
        )}

        <Input
          label="Contraseña"
          placeholder="Contraseña"
          textContentType="password"
          placeholderTextColor="#A2A6A9"
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
        <Button
          title="Iniciar sesion con Email"
          onPress={handleSubmit(login)}
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
