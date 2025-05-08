import { Link, Redirect, router } from "expo-router";

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountAPI, printAsyncStorage } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { APP_FONT } from "@/utils/constant";
// import welcomeBg from "";
SplashScreen.preventAutoHideAsync();

const RootPage = () => {
  const { setAppState, appState } = useCurrentApp();
  const [state, setState] = useState<any>();
  const [loaded, error] = useFonts({
    [APP_FONT]: require("@/assets/font/OpenSans-Regular.ttf"),
  });
  useEffect(() => {
    // AsyncStorage.removeItem("access_token");
    async function prepare() {
      try {
        //expo font

        const res = await getAccountAPI();
        const access_token = await AsyncStorage.getItem("access_token");
        if (res.data) {
          setAppState({
            data: res.data.data,
          });
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/welcome");
          //S
        }
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
      } catch (e) {
        router.replace("/(auth)/welcome");
        console.warn(e);
        setState(() => {
          throw new Error("Cannot connect to backend ");
        });
      } finally {
        // Tell the application to render
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
  return <></>;
};
export default RootPage;
