import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { useCurrentApp } from "@/context/app.context";
import { updateUserAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { UpdateAccountSchema } from "@/utils/validate.schema";
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
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  title: {
    fontWeight: "600",
    fontSize: 30,
    marginBottom: 20,
  },
});

const UserInfo = () => {
  const { appState, setAppState } = useCurrentApp();
  const backend =
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_ANDROID_API_URL
      : process.env.EXPO_PUBLIC_IOS_API_URL;
  const avatarDefault = `${backend}/images/avatar/`;

  // Handle form submission
  const handleUpdate = async (
    values: { name: string; phone: string; email: string },
    { setSubmitting }: any
  ) => {
    try {
      const _id = appState?.data.user._id as string;
      const res = await updateUserAPI(_id, values.name, values.phone);
      if (res.data) {
        setAppState({
          ...appState!,
          data: {
            ...appState!.data,
            user: {
              ...appState!.data.user,
              name: values.name,
              phone: values.phone,
            },
          },
        });
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
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Image
              style={styles.avatar}
              source={{ uri: `${avatarDefault}${appState?.data.user?.avatar}` }}
            />
          </View>

          <View style={{ marginHorizontal: 10 }}>
            <Formik
              initialValues={{
                name: appState?.data.user?.name || "",
                email: appState?.data.user?.email || "",
                phone: appState?.data.user?.phone || "",
              }}
              validationSchema={UpdateAccountSchema}
              onSubmit={handleUpdate}
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
                    title="Name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    error={touched.name && errors.name ? errors.name : ""}
                    placeholder="Enter your name"
                  />
                  <ShareInput
                    title="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email && errors.email ? errors.email : ""}
                    placeholder="Enter your email"
                    editable={false} // Email is read-only
                  />
                  <ShareInput
                    title="Phone"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    error={touched.phone && errors.phone ? errors.phone : ""}
                    placeholder="Enter your phone number"
                  />

                  <ShareButton
                    title={isSubmitting ? "Updating..." : "Update"}
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

export default UserInfo;
