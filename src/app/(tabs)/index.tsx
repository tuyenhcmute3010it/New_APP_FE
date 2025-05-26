// src/screens/HomeTab.tsx
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import CustomFlatList from "@/components/CustomFlatList/CustomFlatList";
import CollectionHome from "@/components/home/collection.home";
import HeaderHome from "@/components/home/header.home";
import SearchHome from "@/components/home/search.home";
import TopListHome from "@/components/home/top.list.home";
import { useCurrentApp } from "@/context/app.context";
import { getArticlesAPI } from "@/utils/api"; // Adjust path to your API file

const HomeTab = () => {
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const { setTheme } = useCurrentApp();

  useEffect(() => {
    setMounted(true);
    const fetchArticles = async () => {
      try {
        const response = await getArticlesAPI(1, 10);
        const formattedData = response.data.data.result.map(
          (article: any, index: number) => ({
            key: index + 1,
            name: article.title,
            description:
              article.content.substring(0, 100) +
              (article.content.length > 100 ? "..." : ""),
            refAPI: `article-${article._id}`,
            thumbnail: article.thumbnail || "https://via.placeholder.com/150", // Fallback thumbnail
          })
        );
        console.log(formattedData);
        setArticles(formattedData);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => {
      router.push("/(auth)/popup.sale");
    }, 1000);
  }, [mounted]);

  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomFlatList
        data={articles}
        style={styles.list}
        renderItem={({ item }) => (
          <CollectionHome
            name={item.name}
            description={item.description}
            refAPI={item.refAPI}
            thumbnail={item.thumbnail} // Pass thumbnail to CollectionHome
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
  list: {
    overflow: "hidden",
  },
});

export default HomeTab;
