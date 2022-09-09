import React, { useState, useRef, useCallback, useContext } from "react";
import styles from "../../styles/App.scss";
import {
  View,
  FlatList,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Avatar, Text, Icon } from "@rneui/themed";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import OpenMap from "react-native-open-maps";
import { EmptyGarage } from "./../../../assets/svg/EmptyGarage";
import ButtonBranch from "../../components/branch/button";
import { NotificationContext } from "../ContextNotifications";
import ActionButton from "react-native-action-button";

export default function ListTalleres(props: any) {
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

  const { vehiculos, navigation } = props;
  let listTalleres = [] as any;

  if (vehiculos) {
    vehiculos.map((vehiculo: any) => {
      if (vehiculo.taller) {
        const found = listTalleres.some(
          (taller: any) => taller.IdTaller === vehiculo.taller.IdTaller
        );
        if (!found) {
          listTalleres.push(vehiculo.taller);
        }
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerMotos}>
        <ImageBackground
          source={require("../../../assets/drawable-xxxhdpi/header_garages.png")}
          style={styles.headerImg}
        >
          <Text style={[styles.headingPrimary, styles.HeaderH2]}>
            Estamos para servirte!
          </Text>
          <Text style={[styles.subheadingPrimary, styles.HeaderSubH2]}>
            Estos son los talleres de los que eres cliente.
          </Text>
        </ImageBackground>
      </View>
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        data={listTalleres}
        renderItem={(taller) => (
          <Taller taller={taller.item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.IdTaller}
        ListEmptyComponent={EmptyList}
      />
      {showButton && <AddCitaButton />}
    </View>
  );
}

function Taller(props: any) {
  const { taller, navigation } = props;

  const { value: NumberNotificacions, resetNotificaciones } =
    useContext(NotificationContext);

  const openAppMap = () => {
    OpenMap({
      travelType: "drive",
      end: taller.nombre,
      provider: "google",
    });
  };

  return (
    <View style={styles.garageCard}>
      <View style={styles.garageCardImage}>
        <Avatar
          rounded
          size="large"
          source={{
            uri: taller.logo,
            // "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
          }}
        />
      </View>
      <View style={styles.garageCardMapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.garageCardMap}
          initialRegion={{
            latitude: 4.72369,
            longitude: -74.090043,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled={false}
          minZoomLevel={14}
          onPress={openAppMap}
          liteMode={true}
        >
          <Marker
            coordinate={{
              latitude: taller.latitude,
              longitude: taller.longitud,
            }}
            draggable
            image={require("./../../../assets/drawable-xhdpi/location-branch.png")}
          />
        </MapView>
      </View>
      <View style={styles.garageCardInfo}>
        <View style={styles.garageCardText}>
          <View style={styles.userInfoItem}>
            <Text style={[styles.headingPrimary, styles.headingGarageCard]}>
              {taller.nombre}
            </Text>
          </View>
          <View style={styles.userInfoItem}>
            <Icon
              name="screen-smartphone"
              type="simple-line-icon"
              color="#0396c8"
              size={25}
            />
            <Text style={[styles.bodyText, styles.userInfo]}>
              {taller.celular}
            </Text>
          </View>
          <View style={styles.userInfoItem}>
            <Icon
              name="location-pin"
              type="simple-line-icon"
              color="#0396c8"
              size={25}
            />
            <Text style={[styles.bodyText, styles.userInfo]}>
              {taller.direccion}
            </Text>
          </View>
        </View>
        <View style={styles.garageCardButtons}>
          <ButtonBranch iconName="chevron-right" onPress={openAppMap} />
          <ButtonBranch
            iconName="chat-processing"
            onPress={() => {
              resetNotificaciones();
              console.log("click", navigation.navigate);
              navigation.navigate("chat", {
                IdTaller: taller.IdTaller,
              });
            }}
            numberNotificaciones={NumberNotificacions}
          />
        </View>
      </View>
    </View>
  );
}
function EmptyList() {
  return (
    <View style={[styles.emptySection, styles.emptyGarage]}>
      <EmptyGarage />
    </View>
  );
}

function AddCitaButton() {
  return (
    <ActionButton
      buttonTextStyle={styles.actionButton}
      buttonColor="#0396c8"
      degrees={0}
      onPress={() => {
        OpenMap({
          zoom: 19,
          query: "Talleres",
        });
      }}
      offsetY={Platform.OS === "ios" ? 100 : 70}
      renderIcon={() => <Icon name="add-location" />}
    >
      {">"}
    </ActionButton>
  );
}
