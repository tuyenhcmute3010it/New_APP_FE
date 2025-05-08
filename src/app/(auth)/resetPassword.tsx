import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import LoadingOverlay from "@/components/loading/overlay";
import { resendCodeAPI, verifyCodeAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { ResetPasswordSchema, SignupSchema } from "@/utils/validate.schema";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-root-toast";

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
const ResetPassword = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const resetPasswordCode = async (email: string) => {
    console.log("lac da");
    setIsSubmit(true);
    try {
      console.log("?email", email);
      const res = await resendCodeAPI(email);
      if (res.data) {
        router.replace({
          pathname: "/(auth)/newPassword",
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
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>Reset Password</Text>
        </View>
        <View style={{ width: 300 }}>
          <Text style={styles.description}>
            Please enter your email address to request a password reset
          </Text>
        </View>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={(values) => resetPasswordCode(values.email)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <ShareInput
                keyBoardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                touched={touched.email}
                error={errors.email}
              />
              <View>
                <ShareButton
                  title="Forgot Password"
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
      </View>
      {isSubmit && <LoadingOverlay />}
    </>
  );
};

export default ResetPassword;
