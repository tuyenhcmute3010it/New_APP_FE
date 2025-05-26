import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { APP_COLOR } from "@/utils/constant";
import axios from "axios";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginAPI, registerAPI } from "@/utils/api";
import { Formik } from "formik";
import { LoginSchema } from "@/utils/validate.schema";
import { useCurrentApp } from "@/context/app.context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  heading: {
    fontSize: 36,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
    color: "#9796A1",
    marginBottom: 30,
  },
  resendBox: {
    marginTop: 20,
    fontSize: 16,
  },
});
const Login = () => {
  const { setAppState } = useCurrentApp();
  const handelLogin = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);
      if (res.data) {
        console.log(">>>>>>>>>>>>", res.data.data.access_token);
        await AsyncStorage.setItem("access_token", res.data.data.access_token);
        const access_token = await AsyncStorage.getItem("access_token");
        setAppState(res.data);
        router.replace({
          pathname: "/(tabs)",
          params: {
            email: email,
          },
        });
      }
    } catch (error: any) {
      console.log(">> error", error);
      const msg =
        error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";

      const finalMsg = Array.isArray(msg) ? msg[0] : msg;
      console.log("error", error?.response?.data);
      if (error?.response?.data?.statusCode === 401) {
        Toast.show(finalMsg, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.GRAY,
          opacity: 1,
        });
        return;
      }

      if (error?.response?.data?.statusCode === 400) {
        Toast.show(finalMsg, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.GRAY,
          opacity: 1,
        });
        router.replace({
          pathname: "/(auth)/verify",
          params: {
            email: email,
            isLogin: "true",
          },
        });
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => handelLogin(values.email, values.password)}
        validationSchema={LoginSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <View>
              <Text
                style={{ fontWeight: "600", fontSize: 30, marginBottom: 20 }}
              >
                Login
              </Text>
            </View>
            <ShareInput
              title="Email"
              keyBoardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email}
              touched={touched.email}
            />
            <ShareInput
              title="Password"
              secureTextEntry={true}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={errors.password}
              touched={touched.password}
            />
            <View
              style={{
                paddingVertical: 20,
                gap: 10,
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Link href={"/(auth)/resetPassword"}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    color: APP_COLOR.GRAY,
                  }}
                >
                  Forgot Password
                </Text>
              </Link>
            </View>
            <View>
              <ShareButton
                title="Login"
                onPress={handleSubmit}
                textStyle={{ textTransform: "uppercase", color: "#fff" }}
                btnStyle={{
                  justifyContent: "center",
                  borderRadius: 50,
                  paddingVertical: 13,
                  marginVertical: 20,
                }}
                pressStyle={{ alignSelf: "stretch", marginHorizontal: 70 }}
              />
            </View>
            <View
              style={{
                paddingVertical: 20,
                gap: 10,
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <View>
                <Text>Don't have an account?</Text>
              </View>
              <View>
                <Link href={"/(auth)/signup"}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: APP_COLOR.GRAY,
                    }}
                  >
                    Sign Up
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};
export default Login;
