import React, { useEffect } from "react";
import styles from "../../styles/App.scss";
import { Text, ScrollView, SafeAreaView, View } from "react-native";
import { Input, Button } from "@rneui/base";
import Snackbar from "react-native-snackbar";
import { useForm } from "react-hook-form";
import useMutation from "../../hooks/useMutation";

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
  const { mutate: createService } = useMutation("servicios/create");

  useEffect(() => {
    register("valor", {
      required: { value: true, message: "Campo requerido" },
    });
  }, [register]);

  const createServicio = async (data: FormData) => {
    //console.log("User logged");

    let servicioCreate = {
      servicio: servicio.nombre,
      valor: data.valor,
      placa: vehiculo.placa,
    };

    console.log("Servicio to create :::>", servicioCreate);

    const { isSuccess, error } = await createService(servicioCreate);

    if (isSuccess) {
      Snackbar.show({
        text: "Se registro el servicio correctamente",
        duration: Snackbar.LENGTH_LONG,
      });
      navigation.navigate("Vehiculo");
      return;
    }

    if (error) {
      Snackbar.show({
        text: "Ocurrio un error al registrar el servicio",
        duration: Snackbar.LENGTH_LONG,
      });
    }
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
