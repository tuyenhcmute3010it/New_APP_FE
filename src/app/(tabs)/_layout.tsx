import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import AccountTab from "./account";
import NotificationTab from "./notification";
import OrderTab from "./order";
import FavoriteTab from "./favorite";
import Ionicons from "@expo/vector-icons/Ionicons";
import { APP_COLOR } from "@/utils/constant";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const TabLayout = () => {
  const Tab = createBottomTabNavigator();
  const getIcons = (routeName: string, focused: boolean, size: number) => {
    if (routeName === "index") {
      return (
        <Ionicons
          name="fast-food"
          size={24}
          color={focused ? APP_COLOR.GRAY : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "article") {
      return (
        <MaterialIcons
          name="list-alt"
          size={size}
          color={focused ? APP_COLOR.GRAY : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "favorite") {
      return (
        <MaterialIcons
          name="favorite"
          size={24}
          color={focused ? APP_COLOR.GRAY : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "account") {
      return (
        <MaterialIcons
          name="account-circle"
          size={24}
          color={focused ? APP_COLOR.GRAY : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "notification") {
      return (
        <Ionicons
          name="notifications"
          size={24}
          color={focused ? APP_COLOR.GRAY : APP_COLOR.GRAY}
        />
      );
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return getIcons(route.name, focused, size);
        },
        headerShown: false,
        tabBarLabelStyle: { paddingBottom: 3 },
        tabBarActiveTintColor: APP_COLOR.GRAY,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="article" options={{ title: "Article" }} />
      <Tabs.Screen name="favorite" options={{ title: "Favorite" }} />
      <Tabs.Screen name="notification" options={{ title: "Notification" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
};
export default TabLayout;
