import {
  AppState,
  Button,
  Image,
  ImageBackground,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { LinearGradient } from "expo-linear-gradient";
import TextBetweenLine from "@/components/text/text.between.line";
import { Link, Redirect, router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountAPI, printAsyncStorage } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import ShareButton from "@/components/button/share.button";
// import welcomeBg from "";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 15,
  },
  welcomeText: {
    flex: 0.6,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },
  welcomeBtn: {
    flex: 0.4,
    marginHorizontal: 50,
  },
  heading: {
    fontWeight: "700",
    fontSize: 50,
    color: APP_COLOR.WHITE,
  },
  body: {
    fontWeight: "600",
    color: APP_COLOR.WHITE,
    fontSize: 40,
    marginVertical: 10,
  },
  footer: {
    color: APP_COLOR.WHITE,
  },
  btnContent: {
    padding: 20,
    width: 140,
    borderRadius: 30,
  },

  viewContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  textContent: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Roboto",
  },
});
const WelcomePage = () => {
  const { setAppState, appState } = useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await getAccountAPI();
      const access_token = await AsyncStorage.getItem("access_token");
      if (res.data) {
        setAppState({
          data: res.data.data,
        });
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/welcome");
        //
      }
    };
    fetchAccount();
  }, []);

  return (
    <>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("@/assets/auth/welcome1.png")}
      >
        <LinearGradient
          style={{ flex: 1 }}
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          locations={[0.5, 0.8]}
        >
          <View style={styles.container}>
            <View style={styles.welcomeText}>
              <Text style={styles.heading}>Welcome To</Text>
              <Text style={styles.body}>The Tokyo Times</Text>
            </View>
            <View style={styles.welcomeBtn}>
              {/* style={styles.viewContent} */}
              {/* <SocialButton  /> */}
              <View>
                <ShareButton
                  title="Start With Your Email"
                  onPress={() => {
                    router.push("/(auth)/login");
                  }}
                  textStyle={{ color: "#fff" }}
                  pressStyle={{ alignSelf: "stretch" }}
                  btnStyle={{
                    justifyContent: "center",
                    borderRadius: 50,
                    backgroundColor: "#2b2b2b",
                    marginTop: 15,
                    marginHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    paddingVertical: 15,
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  gap: 8,
                  marginTop: 15,
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <View>
                  <Text style={{ color: "#fff", fontSize: 15 }}>
                    Don't have a account yet?
                  </Text>
                </View>
                <View>
                  <Link href={"/(auth)/signup"}>
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        color: "#fff",
                        fontSize: 15,
                      }}
                    >
                      Sign Up
                    </Text>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};
export default WelcomePage;
