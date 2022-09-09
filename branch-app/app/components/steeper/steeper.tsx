import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Image } from "@rneui/themed";
import styles from "../../styles/App.scss";

export function Step(props: any) {
  return (
    <View
      style={[
        styles.stepperStep,
        {
          shadowColor: "#A2DEDE",
          shadowOffset: { width: -2, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 10,
        },
      ]}
    >
      {props.children}
    </View>
  );
}

export default function ReactSteps(props: any) {
  let { currentPosition, onHandleChange, children } = props;

  const onPressChanged = (index: any) => {
    onHandleChange(index);
  };

  let contents = children.map((item: any, index: number) => {
    if (item) {
      return (
        <View key={item.props.title} style={styles.stepperContent}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={onPressChanged.bind(item, index)}
          >
            <View>
              <Image
                source={require("./../../../assets/drawable-xxxhdpi/step.png")}
                style={styles.iconButtonImage}
              />
              <Text style={[styles.headingSecondary, styles.stepperHeading]}>
                {index + 1}
              </Text>
            </View>
            <View>
              <Text style={[styles.headingSecondary, styles.stepperHeading]}>
                {item.props.title}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.stepperLine} />
          <View
            style={{ display: currentPosition !== index ? "none" : "flex" }}
          >
            {item}
          </View>
        </View>
      );
    }
  });
  return <View style={styles.stepperContainer}>{contents}</View>;
}
