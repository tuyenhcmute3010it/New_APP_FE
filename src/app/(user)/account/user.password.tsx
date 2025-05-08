import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { useCurrentApp } from "@/context/app.context";
import { updatePassword, updateUserAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import {
  UpdateAccountSchema,
  UpdateUserPasswordSchema,
} from "@/utils/validate.schema";
import { router } from "expo-router";
import { Formik } from "formik";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },

  title: {
    fontWeight: "600",
    fontSize: 30,
    marginBottom: 20,
  },
});

const UpdatePassword = () => {
  const { appState, setAppState } = useCurrentApp();
  const backend =
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_ANDROID_API_URL
      : process.env.EXPO_PUBLIC_IOS_API_URL;
  const avatarDefault = `${backend}/images/avatar/`;

  // Handle form submission
  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    try {
      const res = await updatePassword(currentPassword, newPassword);
      if (res.data) {
        Toast.show("Update Successfully", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.GRAY,
          opacity: 1,
        });

        router.back(); // Adjust based on your app's flow
      }
    } catch (error: any) {
      console.log(">> error", error);
      const msg =
        error?.response?.data?.message || "Update failed. Please try again.";
      const finalMsg = Array.isArray(msg) ? msg[0] : msg;

      Toast.show(finalMsg, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.GRAY,
        opacity: 1,
      });

      if (error?.response?.data?.statusCode === 401) {
        // Handle unauthorized (e.g., redirect to login)
        router.replace("/(auth)/login");
      } else if (error?.response?.data?.statusCode === 400) {
        // Handle bad request (e.g., invalid data)
        console.log("Bad request details:", error?.response?.data);
      }
    } finally {
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{ marginHorizontal: 10 }}>
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              validationSchema={UpdateUserPasswordSchema}
              onSubmit={(values) =>
                handleUpdatePassword(
                  values.currentPassword,
                  values.newPassword,
                  values.confirmNewPassword
                )
              }
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                isValid,
                dirty,
              }) => (
                <View>
                  <Text style={styles.title}>Update Account</Text>
                  <ShareInput
                    title="Current Password"
                    value={values.currentPassword}
                    onChangeText={handleChange("currentPassword")}
                    onBlur={handleBlur("currentPassword")}
                    error={errors.currentPassword}
                    touched={touched.currentPassword}
                    secureTextEntry={true}
                    placeholder="Enter your currentPassword"
                  />
                  <ShareInput
                    title="New Password"
                    value={values.newPassword}
                    onChangeText={handleChange("newPassword")}
                    onBlur={handleBlur("newPassword")}
                    secureTextEntry={true}
                    error={errors.newPassword}
                    touched={touched.newPassword}
                    placeholder="Enter your newPassword"
                  />
                  <ShareInput
                    title="Confirm New Password"
                    value={values.confirmNewPassword}
                    secureTextEntry={true}
                    onChangeText={handleChange("confirmNewPassword")}
                    onBlur={handleBlur("confirmNewPassword")}
                    error={errors.confirmNewPassword}
                    touched={touched.confirmNewPassword}
                    placeholder="Enter your confirmNewPassword "
                  />

                  <ShareButton
                    title={isSubmitting ? "Updating..." : "Update Password"}
                    onPress={handleSubmit}
                    textStyle={{ textTransform: "uppercase", color: "#fff" }}
                    btnStyle={{
                      justifyContent: "center",
                      borderRadius: 50,
                      marginVertical: 20,
                      width: 200,
                      backgroundColor:
                        isValid && dirty ? APP_COLOR.GRAY : APP_COLOR.GREY,
                    }}
                    pressStyle={{
                      alignSelf: "center",
                    }}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;
