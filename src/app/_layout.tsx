import { ErrorBoundaryProps, Slot, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import AppProvider from "@/context/app.context";
import { fa } from "@faker-js/faker/.";
import { Button, Text, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 10, gap: 15 }}>
        <View
          style={{
            backgroundColor: "#333",
            padding: 10,
            borderRadius: 3,
            gap: 10,
          }}
        >
          <Text style={{ color: "red", fontSize: 20 }}>
            Something went wrong
          </Text>
          <Text style={{ color: "#fff" }}>{error.message}</Text>
        </View>
        <Button title="Try Again ?" onPress={retry} />
      </View>
    </SafeAreaView>
  );
}
const RootLayout = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <RootSiblingParent>
      <AppProvider>
        {/* <SafeAreaView style={{ flex: 1 }}> */}
        <ThemeProvider value={navTheme}>
          <Stack
            screenOptions={{
              headerTintColor: APP_COLOR.GRAY,
              headerStyle: {
                backgroundColor: "white",
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
              contentStyle: { backgroundColor: "#fff" },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen
              name="(auth)/signup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/verify"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/resetPassword"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/index"
              options={{ headerTitle: "Product", headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerTitle: "Login", headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/welcome"
              options={{ headerTitle: "welcome", headerShown: false }}
            />
            <Stack.Screen
              name="product/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="product/create.modal"
              options={{
                headerShown: false,
                animation: "fade",
                presentation: "transparentModal",
              }}
            />
            <Stack.Screen
              name="product/update.modal"
              options={{
                headerShown: false,
                animation: "fade",
                presentation: "transparentModal",
              }}
            />
            <Stack.Screen
              name="(auth)/popup.sale"
              options={{
                headerShown: false,
                animation: "fade",
                presentation: "transparentModal",
              }}
            />

            <Stack.Screen
              name="(user)/account/user.info"
              options={{
                headerTitle: "Update Information",
              }}
            />
            <Stack.Screen
              name="(user)/account/user.password"
              options={{
                headerTitle: "Update Password",
              }}
            />
            <Stack.Screen
              name="(auth)/newPassword"
              options={{
                headerTitle: "Update Password",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(auth)/search"
              options={{
                headerTitle: "Update Password",
                headerShown: false,
              }}
            />
          </Stack>
        </ThemeProvider>
        {/* </SafeAreaView> */}
      </AppProvider>
    </RootSiblingParent>
  );
};
export default RootLayout;
