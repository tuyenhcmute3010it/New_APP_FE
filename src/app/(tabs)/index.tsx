import CustomFlatList from "@/components/CustomFlatList/CustomFlatList";
import CollectionHome from "@/components/home/collection.home";
import HeaderHome from "@/components/home/header.home";
import SearchHome from "@/components/home/search.home";
import TopListHome from "@/components/home/top.list.home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AccountTab from "./account";

import NotificationTab from "./notification";
import FavoriteTab from "./favorite";
import { useCurrentApp } from "@/context/app.context";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import ShareButton from "@/components/button/share.button";
import { fa } from "@faker-js/faker/.";
// const data = Array(10).fill(1);
const data = [
  {
    key: 1,
    name: "Top 5★ Rating Restaurants this week",
    description:
      "These are the highest-rated restaurants this week based on user reviews.",
    refAPI: "top-rating",
  },
  {
    key: 2,
    name: "New Restaurants",
    description:
      "Discover the latest restaurants that have just joined our platform.",
    refAPI: "newcomer",
  },
  {
    key: 3,
    name: "Eat Satisfied, Free Shipping 0 VND",
    description: "Order now with no shipping fee from selected restaurants.",
    refAPI: "top-freeship",
  },
];
const HomeTab = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => {
      router.push("/(auth)/popup.sale");
    }, 1000);
  }, [mounted]);

  const Tab = createBottomTabNavigator();
  const { setTheme } = useCurrentApp();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomFlatList
        data={data}
        style={styles.list}
        renderItem={({ item }) => (
          <CollectionHome
            name={item.name}
            description={item.description}
            refAPI={item.refAPI}
          />
        )}
        HeaderComponent={<HeaderHome />}
        StickyElementComponent={<SearchHome />}
        TopListElementComponent={<TopListHome />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecf0f1",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: 8,
  },
  header: {
    borderColor: "red",
    borderWidth: 5,
    height: 100,
    marginBottom: 6,
    width: "100%",
  },
  item: {
    borderColor: "green",
    borderWidth: 1,
    height: 250,
    marginBottom: 6,
    width: "100%",
  },
  list: {
    overflow: "hidden",
  },
  sticky: {
    backgroundColor: "#2555FF50",
    borderColor: "blue",
    borderWidth: 5,
    height: 100,
    marginBottom: 6,
    width: "100%",
  },
  topList: {
    borderColor: "GRAY",
    borderWidth: 5,
    minHeight: 100,
    marginBottom: 6,
    width: "100%",
  },
});

export default HomeTab;
