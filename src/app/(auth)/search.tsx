import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect } from "react";
import { APP_COLOR, APP_FONT } from "@/utils/constant";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  SafeAreaView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { getArticlesByQuery } from "@/utils/api";

// Category data
const data1 = [
  { key: 1, name: "Football", source: require("@/assets/icons/football.jpg") },
  { key: 2, name: "Politics", source: require("@/assets/icons/politics.jpg") },
  {
    key: 3,
    name: "Volleyball",
    source: require("@/assets/icons/volleyball.jpg"),
  },
  { key: 4, name: "Healthcare", source: require("@/assets/icons/health.jpg") },
  { key: 5, name: "Economy", source: require("@/assets/icons/economy.jpg") },
  { key: 6, name: "Culture", source: require("@/assets/icons/culture.jpg") },
  {
    key: 7,
    name: "Education",
    source: require("@/assets/icons/education.jpg"),
  },
  {
    key: 8,
    name: "Technology",
    source: require("@/assets/icons/technology.jpg"),
  },
  {
    key: 9,
    name: "Entertain",
    source: require("@/assets/icons/entertainment.jpg"),
  },
  { key: 10, name: "Travel", source: require("@/assets/icons/travel.jpg") },
  { key: 11, name: "Law", source: require("@/assets/icons/law.jpg") },
  { key: 12, name: "Military", source: require("@/assets/icons/military.jpg") },
  { key: 13, name: "Vehicles", source: require("@/assets/icons/car.jpg") },
  {
    key: 14,
    name: "Real Estate",
    source: require("@/assets/icons/real-estate.jpg"),
  },
  { key: 15, name: "Fashion", source: require("@/assets/icons/fashion.jpg") },
  { key: 16, name: "Cuisine", source: require("@/assets/icons/food.jpg") },
  { key: 17, name: "Fitness", source: require("@/assets/icons/fitness.jpg") },
  {
    key: 18,
    name: "Environment",
    source: require("@/assets/icons/environment.jpg"),
  },
  { key: 19, name: "World", source: require("@/assets/icons/world.jpg") },
  { key: 20, name: "Science", source: require("@/assets/icons/science.jpg") },
];

interface IArticle {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    email?: string;
  };
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<IArticle[]>([]);

  // Fetch articles when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setArticles([]);
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await getArticlesByQuery(searchQuery);
        console.log("Search articles response:", response.data);
        setArticles(response.data.data.result || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      }
    };

    fetchArticles();
  }, [searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Pressable onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color={APP_COLOR.GRAY} />
          </Pressable>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Article..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
        >
          <FlatList
            contentContainerStyle={{ alignSelf: "flex-start" }}
            numColumns={Math.ceil(data1.length / 3)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={data1}
            renderItem={({ item }) => (
              <View style={{ padding: 5, width: 100, alignItems: "center" }}>
                <Image
                  style={{ width: 35, height: 35 }}
                  source={item.source}
                  resizeMode="contain"
                />
                <Text style={{ fontFamily: APP_FONT, fontSize: 12 }}>
                  {item.name}
                </Text>
              </View>
            )}
          />
        </ScrollView>

        {/* Article Results */}
        <FlatList
          data={articles}
          renderItem={({ item }) => (
            <Pressable
              style={styles.articleItem}
              onPress={() =>
                router.navigate({
                  pathname: "/article/[id]",
                  params: { id: item._id },
                })
              }
            >
              {item.thumbnail ? (
                <Image
                  style={styles.thumbnail}
                  source={{ uri: item.thumbnail }}
                  onError={() =>
                    console.log(`Failed to load thumbnail for ${item._id}`)
                  }
                />
              ) : (
                <View style={styles.placeholderThumbnail} />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: APP_FONT,
                    fontSize: 16,
                    fontWeight: "600",
                    color: APP_COLOR.GRAY,
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: APP_FONT,
                    fontSize: 12,
                    color: "#666",
                    marginTop: 5,
                  }}
                  numberOfLines={2}
                >
                  {item.content.substring(0, 100) +
                    (item.content.length > 100 ? "..." : "")}
                </Text>
                <Text
                  style={{
                    fontFamily: APP_FONT,
                    fontSize: 12,
                    color: "#666",
                    marginTop: 5,
                  }}
                >
                  By {item.author.name}
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Not Found Article"
                : "Input name or content of article to find"}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
    marginTop: 20,
  },
  searchContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    fontFamily: APP_FONT,
  },
  articleItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  placeholderThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
    fontFamily: APP_FONT,
  },
});

export default Search;
