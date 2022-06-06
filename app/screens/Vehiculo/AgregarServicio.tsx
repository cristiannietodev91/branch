import React, { useState, useEffect } from "react";
import styles from "../../styles/App.scss";
import { Text, ScrollView, SafeAreaView, View } from "react-native";
import { Input, Button } from "@rneui/themed";
import Snackbar from "react-native-snackbar";
import { URL_SERVICES } from "@env";
import { useForm } from "react-hook-form";

type FormData = {
  valor: string;
};

export default function AgregarServicio(props: any) {
  const { navigation } = props;
  const { servicio, vehiculo } = navigation.state.params;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    register("valor", {
      required: { value: true, message: "Campo requerido" },
    });
  }, [register]);

  const createServicio = async (data: any) => {
    //console.log("User logged");

    let servicioCreate = {
      servicio: servicio.nombre,
      valor: data.valor,
      placa: vehiculo.placa,
    };

    console.log("Servicio to create :::>", servicioCreate);

    fetch(URL_SERVICES + "servicios/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(servicioCreate),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          Snackbar.show({
            text: "Ocurrio un error al registrar el servicio",
            duration: Snackbar.LENGTH_LONG,
          });
        } else {
          Snackbar.show({
            text: "Se registro el servicio correctamente",
            duration: Snackbar.LENGTH_LONG,
          });
        }
        navigation.navigate("Vehiculo");
      })
      .catch((error) => console.error(error));
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            Agrega servicios para controlar
          </Text>
          <Text style={[styles.headingSecondary, styles.centerText]}>
            cada gasto de tu vehiculo de placa {vehiculo.placa}
          </Text>
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            Cuanto gastaste en
          </Text>
          <Text style={[styles.headingSecondary, styles.centerText]}>
            {servicio.nombre}
          </Text>
        </View>

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Valor"
          placeholder="Valor"
          textContentType="telephoneNumber"
          onChangeText={(text) => setValue("valor", text)}
          keyboardType="number-pad"
        />
        {errors.valor && (
          <Text style={styles.inputError}>{errors.valor.message}</Text>
        )}

        <Button
          title="Crear"
          onPress={handleSubmit(createServicio)}
          buttonStyle={styles.buttonPrimary}
        />
        <Button
          title="Cancelar"
          onPress={() => {
            navigation.navigate("Servicios");
          }}
          buttonStyle={[styles.buttonSecondary, { marginBottom: 70 }]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
