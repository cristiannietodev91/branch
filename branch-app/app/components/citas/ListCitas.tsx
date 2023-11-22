import React, { useState, useRef, useCallback, useContext } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Icon, Text, Image } from "@rneui/themed";
import Moment from "moment";
import styles from "../../styles/App.scss";
import ButtonBranch from "../../components/branch/button";
import { EmptyDate } from "./../../../assets/svg/EmptyDate";
import { SwipeListView } from "react-native-swipe-list-view";
import { NotificationContext } from "../ContextNotifications";
import ActionButton from "react-native-action-button";
import { ActiveAppointmentStackScreenProps } from "../../../types/types";

interface ListCitasProps
  extends Pick<
    ActiveAppointmentStackScreenProps<"NavigateAppointment">,
    "navigation"
  > {
  citas: any[];
  etapa?: string;
  taller?: any;
}

interface AddCitaButtonProps
  extends Pick<
    ActiveAppointmentStackScreenProps<"NavigateAppointment">,
    "navigation"
  > {}

interface CitaProps
  extends Pick<
    ActiveAppointmentStackScreenProps<"NavigateAppointment">,
    "navigation"
  > {
  cita: any;
  taller: any;
}

export default function ListCitas(props: ListCitasProps) {
  const useHandleScroll = () => {
    const [showButton, setShowButton] = useState(true);

    const scrollOffset = useRef(0);

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const CustomLayoutLinear = {
          duration: 100,
          create: {
            type: LayoutAnimation.Types.linear,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.linear,
            property: LayoutAnimation.Properties.opacity,
          },
          delete: {
            type: LayoutAnimation.Types.linear,
            property: LayoutAnimation.Properties.opacity,
          },
        };
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction =
          currentOffset > 0 && currentOffset > scrollOffset.current
            ? "down"
            : "up";
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === "up";
        if (isActionButtonVisible !== showButton) {
          LayoutAnimation.configureNext(CustomLayoutLinear);
          setShowButton(isActionButtonVisible);
        }
        // Update your scroll position
        scrollOffset.current = currentOffset;
      },
      [showButton]
    );

    return { handleScroll, showButton };
  };

  const { handleScroll, showButton } = useHandleScroll();

  const { citas, taller, navigation } = props;
  return (
    <View style={[styles.container, { padding: 1 }]}>
      <View style={styles.headerDates}>
        <ImageBackground
          source={require("../../../assets/drawable-xxxhdpi/header_date.png")}
          style={styles.headerImg}
        >
          <Text style={[styles.subheadingPrimary, styles.headingDates]}>
            Este es la historia de tu moto en todos los servicios al taller
          </Text>
        </ImageBackground>
      </View>
      <SwipeListView
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        data={citas}
        renderItem={(cita) => (
          <Cita cita={cita.item} navigation={navigation} taller={taller} />
        )}
        renderHiddenItem={() => (
          <View style={styles.motoDeleteContainer}>
            <TouchableOpacity>
              <Icon
                name="trash-can-outline"
                type="material-community"
                color="#FFFFFF"
                size={22}
              />
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-100}
        style={styles.datesContainer}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={EmptyList}
      />
      {showButton && <AddCitaButton navigation={navigation} />}
    </View>
  );
}

function Cita(props: CitaProps) {
  const { cita, navigation } = props;
  let fechaCita = Moment(cita.fechaCita.toString()).format("YYYY-MM-DD");
  let dateFecha = Moment(fechaCita + "T" + cita.horaCita);
  let fechaHora = Moment(dateFecha).format("hh:mm A");
  const { resetNotificaciones } = useContext(NotificationContext);

  return (
    <View style={styles.cardMoto}>
      <View style={styles.cardMotoImageContainer}>
        <Image
          style={styles.cardMotoImage}
          // source={{ uri: cita.vehiculo.fotos.url }}
          source={require("./../../../assets/drawable-xxxhdpi/imageNoMoto.png")}
        />
      </View>
      <View style={styles.cardMotoInfo}>
        <Text style={styles.headingSecondary}>{cita.servicio}</Text>
        <Text style={styles.bodyText}>
          Taller: <Text style={styles.bodyTextBold}>{cita.taller.nombre}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Placa: <Text style={styles.bodyTextBold}>{cita.vehiculo.placa}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Estado: <Text style={styles.bodyTextBold}>{cita.estado}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Fecha: <Text style={styles.bodyTextBold}>{fechaCita}</Text>
        </Text>
        <Text style={styles.bodyText}>
          Hora: <Text style={styles.bodyTextBold}>{fechaHora}</Text>
        </Text>
      </View>
      {cita.estado === "Cumplida" && (
        <View>
          <ButtonBranch
            iconName="chevron-right"
            onPress={() => {
              navigation.navigate("Detail", {
                cita,
              });
            }}
          />
          <ButtonBranch
            iconName="chat-processing"
            onPress={() => {
              resetNotificaciones();
              navigation.navigate("Chat", {
                IdTaller: cita.IdTaller,
              });
            }}
          />
        </View>
      )}
    </View>
  );
}

function EmptyList() {
  return (
    <View style={[styles.emptySection, styles.emptyDate]}>
      <EmptyDate />
    </View>
  );
}

function AddCitaButton(props: AddCitaButtonProps) {
  const { navigation } = props;
  return (
    <ActionButton
      buttonTextStyle={styles.actionButton}
      buttonColor="#0396c8"
      degrees={0}
      offsetY={Platform.OS === "ios" ? 100 : 70}
      onPress={() => {
        navigation.navigate("Addappoinment");
      }}
      renderIcon={() => <Icon name="add-box" />}
    >
      {">"}
    </ActionButton>
  );
}
