import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Pdf from "react-native-pdf";

export default function EditarVehiculo(props: any) {
  const { navigation } = props;
  const { pdf } = navigation.state.params;

  return (
    <View style={styles.container}>
      <Pdf
        source={pdf}
        onLoadComplete={(numberOfPages) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page) => {
          console.log(`current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link presse: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
