import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { APP_COLOR } from "@/utils/constant";
import axios from "axios";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerAPI } from "@/utils/api";
import { Formik } from "formik";
import { SignupSchema } from "@/utils/validate.schema";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
});
const SignUpPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handelSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const res = await registerAPI(name, email, password);
      if (res.data) {
        router.replace({
          pathname: "/(auth)/verify",
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

      Toast.show(finalMsg, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.GRAY,
        opacity: 1,
      });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={(values) =>
          handelSignUp(values.email, values.password, values.name)
        }
        validationSchema={SignupSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.container}>
            <View>
              <Text
                style={{ fontWeight: "600", fontSize: 30, marginBottom: 20 }}
              >
                Register
              </Text>
            </View>

            <ShareInput
              title="Email"
              keyBoardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email}
            />
            <ShareInput
              title="Password"
              secureTextEntry={true}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={errors.password}
            />
            <ShareInput
              title="Name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              error={errors.name}
            />
            <View>
              <ShareButton
                title="Register"
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
                <Text>Already have an account?</Text>
              </View>
              <View>
                <Link href={"/(auth)/login"}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: APP_COLOR.GRAY,
                    }}
                  >
                    Login
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
export default SignUpPage;
