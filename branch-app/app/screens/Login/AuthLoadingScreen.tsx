import { useState, useEffect, useCallback } from "react";

import auth from "@react-native-firebase/auth";

export default function AuthLoadingScreen() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    (user: any) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing]
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing) {
    return null;
  }

  if (!user) {
    //TODO: Types navigation
    //return navigation.navigate("Auth");
  } else {
    //return navigation.navigate("Main");
  }
}
