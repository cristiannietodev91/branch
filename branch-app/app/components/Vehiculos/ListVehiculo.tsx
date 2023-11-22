import React, { useState, useRef, useCallback } from "react";
import styles from "../../styles/App.scss";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Icon, Image, Text } from "@rneui/themed";
import { EmptyMoto } from "./../../../assets/svg/EmptyMoto";
import { SwipeListView } from "react-native-swipe-list-view";
import ButtonBranch from "../../components/branch/button";
import ActionButton from "react-native-action-button";
import {
  ListVehicles,
  Vehicle,
  VehicleScreenNavigationProp,
} from "../../../types/types";
import { useNavigation } from "@react-navigation/native";

interface ListVehiculosProps {
  user: any;
  vehicles: ListVehicles;
}

interface VehicleComponentProps {
  vehicle: Vehicle;
}

export default function ListVehiculos({ vehicles, user }: ListVehiculosProps) {
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

  return (
    <View style={styles.container}>
      <View style={styles.headerMotos}>
        <ImageBackground
          source={require("../../../assets/drawable-xxxhdpi/header_moto.png")}
          style={styles.headerImg}
        >
          <Text style={[styles.headingPrimary, styles.HeaderH2]}>
            {user.displayName}
          </Text>
          <Text style={[styles.subheadingPrimary, styles.HeaderSubH2]}>
            Este es tu garaje personal donde encuentras todas tus motos.
          </Text>
        </ImageBackground>
      </View>

      <SwipeListView<Vehicle>
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        data={vehicles}
        renderItem={(vehiculo) => <Vehiculo vehicle={vehiculo.item} />}
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
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={EmptyList}
      />
      {showButton && <AddVehiculoButton />}
    </View>
  );
}

function Vehiculo(props: VehicleComponentProps) {
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const { vehicle } = props;

  return (
    <View style={styles.cardMoto}>
      {!(vehicle.fotos && vehicle.fotos[0] && vehicle.fotos.length > 0) ? (
        <View style={styles.cardMotoImageContainer}>
          <Image
            style={styles.cardMotoImage}
            source={require("./../../../assets/drawable-xxxhdpi/imageNoMoto.png")}
          />
        </View>
      ) : (
        <View style={styles.cardMotoImageContainer}>
          <Image
            style={styles.cardMotoImage}
            source={{ uri: vehicle.fotos[0].url }}
          />
        </View>
      )}
      <View style={styles.cardMotoInfo}>
        <Text style={styles.headingSecondary}>
          {vehicle.marca.marca} {vehicle.marca.referencia}
        </Text>
        <Text style={styles.bodyText}>{vehicle.alias}</Text>
        <Text style={styles.bodyText}>{vehicle.placa}</Text>
        <Text style={styles.bodyText}>{vehicle.kilometraje} Km</Text>
      </View>
      <View>
        <ButtonBranch
          iconName="file-document-outline"
          onPress={() => {
            navigation.navigate("Documents", {
              vehicle,
            });
          }}
        />
        <ButtonBranch
          iconName="pencil-outline"
          onPress={() => {
            navigation.navigate("Edit", {
              vehicle,
            });
          }}
        />
        <ButtonBranch
          iconName="currency-usd"
          onPress={() => {
            navigation.navigate("Services", {
              vehicle,
            });
          }}
        />
      </View>
    </View>
  );
}

function EmptyList() {
  return (
    <View style={[styles.emptySection, styles.emptyMoto]}>
      <EmptyMoto />
    </View>
  );
}

function AddVehiculoButton() {
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  return (
    <ActionButton
      buttonTextStyle={styles.actionButton}
      buttonColor="#0396c8"
      degrees={0}
      onPress={() => {
        navigation.navigate("Add");
      }}
      offsetY={Platform.OS === "ios" ? 100 : 70}
      renderIcon={() => <Icon name="add" />}
    >
      {">"}
    </ActionButton>
  );
}
