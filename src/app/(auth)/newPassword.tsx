import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { forgotPassword } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { ForgotPassword } from "@/utils/validate.schema";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginVertical: 70,
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
const NewPassword = () => {
  const { email } = useLocalSearchParams();

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const handleForgotPassword = async (code: string, newPassword: string) => {
    setIsSubmit(true);
    try {
      console.log(">>>>>> email ne", email);
      const password = newPassword;
      const res = await forgotPassword(code, email as string, password);
      if (res.data) {
        router.replace("/(auth)/login");
        Toast.show("Update Password Success", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.GRAY,
          opacity: 1,
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
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        initialValues={{ code: "", newPassword: "", confirmNewPassword: "" }}
        onSubmit={(values) =>
          handleForgotPassword(values.code, values.newPassword)
        }
        validationSchema={ForgotPassword}
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
              title="Code"
              onChangeText={handleChange("code")}
              onBlur={handleBlur("code")}
              value={values.code}
              error={errors.code}
              touched={touched.code}
            />
            <ShareInput
              title="New Password"
              secureTextEntry={true}
              onChangeText={handleChange("newPassword")}
              onBlur={handleBlur("newPassword")}
              value={values.newPassword}
              error={errors.newPassword}
              touched={touched.newPassword}
            />
            <ShareInput
              title="Confirm Password"
              secureTextEntry={true}
              onChangeText={handleChange("confirmNewPassword")}
              onBlur={handleBlur("confirmNewPassword")}
              value={values.confirmNewPassword}
              error={errors.confirmNewPassword}
              touched={touched.confirmNewPassword}
            />

            <View>
              <ShareButton
                title="Update Password"
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
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};
export default NewPassword;
