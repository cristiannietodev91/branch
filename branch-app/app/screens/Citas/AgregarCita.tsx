import React, { useState, useEffect } from "react";
import styles from "../../styles/App.scss";
import { View, SafeAreaView, Text, Platform } from "react-native";
import { Input, Button, Image } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "react-hook-form";
import Moment from "moment";
import { services } from "../../../data/data";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ActiveAppointmentStackScreenProps,
  ListVehicles,
  Vehicle,
} from "../../../types/types";
import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";
import Snackbar from "react-native-snackbar";

type FormData = {
  placa: string;
  fechacita?: Date;
  horacita?: Date;
  servicio: string;
};

export default function AgregarCita({
  navigation,
}: ActiveAppointmentStackScreenProps<"AddAppointment">) {
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
  const [vehiculoSelect, setVehiculoSelect] = useState<Vehicle>();
  const [placaValue, setPlacaValue] = useState<string>("");
  const [servicioValue, setServicioValue] = useState<string>("");

  const user = auth().currentUser;

  const { data: vehicles, getData: getVehicles } = useFetch<ListVehicles>(
    `vehiculo/getByIdUsuario/${user?.uid}`
  );

  const { mutate: createAppointment } = useMutation("cita/create");

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

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

  const createCita = async (data: FormData) => {
    if (vehicles) {
      let vehiculo = vehicles.find((vehiculo) => {
        if (vehiculo.placa === data.placa) {
          return vehiculo;
        }
      });
      if (vehiculo && vehiculo.taller) {
        const citaCreate = {
          placa: data.placa,
          taller: vehiculo.taller.IdTaller,
          fechaCita: Moment(data.fechacita).format("YYYY/MM/DD"),
          horaCita: Moment(data.horacita).format("HH:mm"),
          servicio: data.servicio,
          estado: "Solicitada",
        };

        const { isSuccess, error } = await createAppointment(citaCreate);

        if (isSuccess) {
          navigation.goBack();
        }

        if (error) {
          Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    }
  };

  const selectVehiculo = (placa: String) => {
    if (vehicles) {
      const vehiculo = vehicles.find((vehiculo) => {
        if (vehiculo.placa === placa) {
          return vehiculo;
        }
      });
      setVehiculoSelect(vehiculo);
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
          style={[styles.input, styles.dropdown]}
          placeholderStyle={{ color: "gray" }}
          selectedTextStyle={{ color: "black" }}
          data={vehicles || []}
          labelField="placa"
          valueField="placa"
          placeholder="Seleccione una placa"
          value={placaValue}
          onChange={(item) => {
            setPlacaValue(item.placa);
            selectVehiculo(item.placa);
            setValue("placa", item.placa);
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
            value={fechaCita}
            mode="date"
            is24Hour={true}
            display="default"
            locale="es-ES"
            onChange={(_, selectedDate) => {
              setShowCalendar(Platform.OS === "ios" ? true : false);
              if (selectedDate) {
                setFechaCita(selectedDate);
                setValue("fechacita", selectedDate);
              }
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
            value={horaCita}
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
          style={[styles.input, styles.dropdown]}
          placeholderStyle={{ color: "gray" }}
          selectedTextStyle={{ color: "black" }}
          data={services}
          labelField="value"
          valueField="value"
          placeholder="Seleccione un servicio"
          value={servicioValue}
          onChange={(item) => {
            setServicioValue(item.value);
            setValue("servicio", item.value);
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
