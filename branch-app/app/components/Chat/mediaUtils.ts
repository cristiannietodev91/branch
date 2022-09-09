import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export async function getLocationAsync(
  onSend: (arg0: { location: Location.LocationObjectCoords }[]) => void
) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === "granted") {
    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      onSend([{ location: location.coords }]);
    }
  } else {
    //TODO: what does the app when access is not allowed
  }
}

export async function pickImageAsync(
  onSend: (arg0: { image: string }[]) => void
) {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === "granted") {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      onSend([{ image: result.uri }]);
      return result.uri;
    }
  } else {
    //TODO: what does the app when access is not allowed
  }
}

export async function takePictureAsync(
  onSend: (arg0: { image: string }[]) => void
) {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status === "granted") {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      onSend([{ image: result.uri }]);
      return result.uri;
    }
  }
}
