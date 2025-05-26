import LoadingOverlay from "@/components/loading/overlay";
import { resendCodeAPI, verifyCodeAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-root-toast";

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
const VerifyPage = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const otpRef = useRef<OTPTextView>(null);
  const [code, setCode] = useState<string>("");
  const { email, isLogin } = useLocalSearchParams();

  console.log(">> check email", email);

  const verifyCode = async () => {
    setIsSubmit(true);
    Keyboard.dismiss();

    try {
      const res = await verifyCodeAPI(email as string, code);
      if (res.data) {
        otpRef?.current?.clear();
        Toast.show("Verify Success", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.GRAY,
          opacity: 1,
        });
        console.log("is login ", isLogin);
        if (isLogin === "true") {
          router.replace("/(auth)/login");
        } else {
          router.replace("/(auth)/login");
        }
      }
    } catch (error: any) {
      setIsSubmit(false);
      console.log(">> error", error);
      const msg = error?.response?.data?.message || "Code is fail";

      const finalMsg = Array.isArray(msg) ? msg[0] : msg;

      Toast.show(finalMsg, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.GRAY,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    if (code && code.length === 6) {
      verifyCode();
      console.log(code);
    }
  }, [code]);

  const handleResendCode = async () => {
    otpRef?.current?.clear();
    //call api

    const res = await resendCodeAPI(email as string);
    const m = res.data ? "Resend code success" : res.message;
    if (res.data) {
      Toast.show(m as string, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.GRAY,
        opacity: 1,
      });
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>Vefification Code</Text>
        </View>
        <View>
          <Text style={styles.description}>
            Please type the verification code sent to {email}
          </Text>
        </View>

        <OTPTextView
          ref={otpRef}
          handleTextChange={setCode}
          autoFocus
          inputCount={6}
          inputCellLength={1}
          tintColor={APP_COLOR.GRAY}
          textInputStyle={{
            borderWidth: 1,
            borderColor: APP_COLOR.GRAY,
            borderBottomWidth: 1,
            borderRadius: 5,
            // @ts-ignore:next-line
            color: APP_COLOR.GRAY,
          }}
        ></OTPTextView>
        <View style={styles.resendBox}>
          <Text
            style={{
              textAlign: "center",
            }}
          >
            I don’t recevie a code!
            <Text
              onPress={() => handleResendCode()}
              style={{ color: APP_COLOR.GRAY }}
            >
              Please resend
            </Text>
          </Text>
        </View>
      </View>
      {isSubmit && <LoadingOverlay />}
    </>
  );
};

export default VerifyPage;
