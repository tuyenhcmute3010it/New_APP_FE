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
import axios from "axios";
import { getRestaurantByName, getUrlBaseBackend } from "@/utils/api";
import { router } from "expo-router";

// Category data
const data1 = [
  {
    key: 1,
    name: "Football",
    source: require("@/assets/icons/football.jpg"),
  },
  {
    key: 2,
    name: "Politics",
    source: require("@/assets/icons/politics.jpg"),
  },
  {
    key: 3,
    name: "Volleyball",
    source: require("@/assets/icons/volleyball.jpg"),
  },
  {
    key: 4,
    name: "Healthcare",
    source: require("@/assets/icons/health.jpg"),
  },
  {
    key: 5,
    name: "Economy",
    source: require("@/assets/icons/economy.jpg"),
  },
  {
    key: 6,
    name: "Culture",
    source: require("@/assets/icons/culture.jpg"),
  },
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
  {
    key: 10,
    name: "Travel",
    source: require("@/assets/icons/travel.jpg"),
  },
  {
    key: 11,
    name: "Law",
    source: require("@/assets/icons/law.jpg"),
  },
  {
    key: 12,
    name: "Military",
    source: require("@/assets/icons/military.jpg"),
  },
  {
    key: 13,
    name: "Vehicles",
    source: require("@/assets/icons/car.jpg"),
  },
  {
    key: 14,
    name: "Real Estate",
    source: require("@/assets/icons/real-estate.jpg"),
  },
  {
    key: 15,
    name: "Fashion",
    source: require("@/assets/icons/fashion.jpg"),
  },
  {
    key: 16,
    name: "Cuisine",
    source: require("@/assets/icons/food.jpg"),
  },
  {
    key: 17,
    name: "Fitness",
    source: require("@/assets/icons/fitness.jpg"),
  },
  {
    key: 18,
    name: "Environment",
    source: require("@/assets/icons/environment.jpg"),
  },
  {
    key: 19,
    name: "World",
    source: require("@/assets/icons/world.jpg"),
  },
  {
    key: 20,
    name: "Science",
    source: require("@/assets/icons/science.jpg"),
  },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  // Fetch restaurants when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setRestaurants([]);
      return;
    }

    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurantByName(searchQuery);
        setRestaurants(response.data.data.result || []);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      }
    };

    fetchRestaurants();
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
                  style={{ padding: 5, width: 35, height: 35 }}
                  source={item.source}
                />
                <Text style={{ fontFamily: APP_FONT }}>{item.name}</Text>
              </View>
            )}
          />
        </ScrollView>

        {/* Restaurant Results */}
        <FlatList
          data={restaurants}
          renderItem={({ item }) => (
            <View>
              <Pressable
                style={styles.restaurantItem}
                onPress={() =>
                  router.navigate({
                    pathname: "/product/[id]",
                    params: { id: item._id },
                  })
                }
              >
                <View>
                  <Text>Search</Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: APP_FONT,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ fontFamily: APP_FONT, color: "#666" }}>
                    {item.address}
                  </Text>
                  <Text style={{ fontFamily: APP_FONT, color: "#666" }}>
                    Rating: {item.rating} ⭐
                  </Text>
                </View>
              </Pressable>
            </View>
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
    backgroundColor: "#ecf0f1",
    padding: 8,
    marginTop: 30,
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
  },
  restaurantItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
    flexDirection: "row",
    gap: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
});
export default Search;
