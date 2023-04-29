import React, { useState, useEffect } from "react";
import styles from "../../styles/App.scss";
import { View, SafeAreaView, Text, Platform } from "react-native";
import { Input, Button, Image } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import { Dropdown } from "react-native-material-dropdown-v2";
import DateTimePicker from "@react-native-community/datetimepicker";
import { URL_SERVICES } from "@env";
import { useForm } from "react-hook-form";
import Moment from "moment";
import { services } from "../../../data/data";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppoinmentScreenNavigationProp } from "../../../types/types";

type FormData = {
  placa: string;
  fechacita?: Date;
  horacita?: Date;
  servicio: string;
};

type Vehiculo = {
  placa: string;
  taller: {
    IdTaller: number;
  };
};

export default function AgregarCita({
  navigation,
}: AppoinmentScreenNavigationProp) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTime, setShowTimeCalendar] = useState(false);
  const [fechaCita, setFechaCita] = useState(new Date());
  const [horaCita, setHoraCita] = useState(new Date());
  const [vehiculoSelect, setVehiculoSelect] = useState<Vehiculo>();

  const user = auth().currentUser;

  useEffect(() => {
    fetch(URL_SERVICES + "vehiculo/getByIdUsuario/" + user?.uid)
      .then((response) => response.json())
      .then((json) => {
        //console.log("Respuesta motos ::>", json);
        setVehiculos(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    register("placa", {
      required: { value: true, message: "Campo requerido" },
    });
    register("fechacita", {
      required: { value: true, message: "Campo requerido" },
    });
    register("horacita", {
      required: { value: true, message: "Campo requerido" },
    });
    register("servicio", {
      required: { value: true, message: "Campo requerido" },
    });
  }, [register]);

  const createCita = async (data: any) => {
    let vehiculo = vehiculos.find((vehiculo) => {
      if (vehiculo.placa === data.placa) {
        return vehiculo;
      }
    });
    const citaCreate = {
      placa: data.placa,
      taller: vehiculo?.taller.IdTaller,
      fechaCita: Moment(data.fechacita).format("YYYY/MM/DD"),
      horaCita: Moment(data.horacita).format("HH:mm"),
      servicio: data.servicio,
      estado: "Solicitada",
    };

    console.log("Data cita :::>", citaCreate);

    fetch(URL_SERVICES + "cita/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(citaCreate),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log("Respuesta de crear la cita ::>", json);
        navigation.navigate("Citas");
      })
      .catch((error) => console.error(error));
  };

  const selectVehiculo = (placa: String) => {
    let vehiculo = vehiculos.find((vehiculo) => {
      if (vehiculo.placa === placa) {
        return vehiculo;
      }
    });
    setVehiculoSelect(vehiculo);
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        extraScrollHeight={150}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.headingSecondary, styles.centerText]}>
          Estamos felices de poder ayudarte
        </Text>
        <View style={[styles.containerAddDatePhoto, styles.regularMargin]}>
          <Image
            style={styles.addDatePhoto}
            source={require("./../../../assets/drawable-xxxhdpi/addDate.png")}
          />
        </View>
        <Text
          style={[
            styles.subheadingSecondary,
            styles.centerText,
            styles.regularMargin,
          ]}
        >
          Agenda tu cita llenando estos datos
        </Text>
        <Dropdown
          label="Placa"
          containerStyle={[styles.input, styles.dropdown]}
          labelExtractor={(label: any) => {
            return label.placa;
          }}
          valueExtractor={(value: any) => {
            return value.placa;
          }}
          data={vehiculos || []} //TODO: Send an array value
          onChangeText={(text: any) => {
            selectVehiculo(text);
            setValue("placa", text);
          }}
        />
        {errors.placa && (
          <Text style={styles.inputError}>{errors.placa.message}</Text>
        )}
        {vehiculoSelect && !vehiculoSelect.taller && (
          <Text
            style={[
              styles.subheadingSecondary,
              styles.centerText,
              styles.regularMargin,
            ]}
          >
            No se puede agendar citas a esta vehiculo
          </Text>
        )}

        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Fecha"
          placeholder="Fecha"
          keyboardType="ascii-capable"
          onFocus={() => {
            setShowCalendar(true);
          }}
          value={Moment(fechaCita).format("DD/MM/YYYY")}
        />
        {showCalendar && (
          <DateTimePicker
            testID="datePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            locale="es-ES"
            onChange={(event, selectedDate) => {
              setShowCalendar(Platform.OS === "ios" ? true : false);
              setValue("fechacita", selectedDate);
              setFechaCita(selectedDate!);
            }}
            minimumDate={new Date()}
          />
        )}
        {errors.fechacita && (
          <Text style={styles.inputError}>{errors.fechacita.message}</Text>
        )}
        <Input
          labelStyle={styles.label}
          inputStyle={styles.input}
          label="Hora"
          placeholder="Hora"
          keyboardType="ascii-capable"
          onFocus={() => {
            setShowTimeCalendar(true);
          }}
          value={Moment(horaCita).format("hh:mm a")}
        />
        {showTime && (
          <DateTimePicker
            testID="TimePicker"
            value={new Date()}
            mode="time"
            is24Hour={false}
            display="default"
            locale="es-ES"
            onChange={(event, selectedDate) => {
              setShowTimeCalendar(Platform.OS === "ios" ? true : false);
              setValue("horacita", selectedDate);
              setHoraCita(selectedDate!);
            }}
          />
        )}
        {errors.horacita && (
          <Text style={styles.inputError}>{errors.horacita.message}</Text>
        )}
        <Dropdown
          label="Servicio"
          data={services}
          containerStyle={[styles.input, styles.dropdown]}
          onChangeText={(text: any) => {
            setValue("servicio", text);
          }}
        />
        {errors.servicio && (
          <Text style={styles.inputError}>{errors.servicio.message}</Text>
        )}
        <Button
          title="Agendar cita"
          onPress={handleSubmit(createCita)}
          buttonStyle={styles.buttonPrimary}
          titleStyle={styles.buttonText}
          disabled={vehiculoSelect && !vehiculoSelect.taller ? true : false}
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
