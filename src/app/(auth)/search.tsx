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
    name: "Hot Deal",
    source: require("@/assets/icons/flash-deals.png"),
  },
  {
    key: 2,
    name: "Quán Ngon",
    source: require("@/assets/icons/nice-shop.png"),
  },
  { key: 3, name: "Tích Điểm", source: require("@/assets/icons/points.png") },
  { key: 4, name: "Ngọt Xỉu", source: require("@/assets/icons/rice.png") },
  {
    key: 5,
    name: "Quán Tiền Bối",
    source: require("@/assets/icons/noodles.png"),
  },
  {
    key: 6,
    name: "Bún, Mì, Phở",
    source: require("@/assets/icons/bun-pho.png"),
  },
  { key: 7, name: "BBQ", source: require("@/assets/icons/bbq.png") },
  { key: 8, name: "Fast Food", source: require("@/assets/icons/fastfood.png") },
  { key: 9, name: "Pizza", source: require("@/assets/icons/Pizza.png") },
  { key: 10, name: "Burger", source: require("@/assets/icons/burger.png") },
  {
    key: 11,
    name: "Sống Khỏe",
    source: require("@/assets/icons/egg-cucmber.png"),
  },
  { key: 12, name: "Giảm 50k", source: require("@/assets/icons/moi-moi.png") },
  {
    key: 13,
    name: "99k Off",
    source: require("@/assets/icons/fried-chicken.png"),
  },
  {
    key: 14,
    name: "No Bụng",
    source: require("@/assets/icons/korean-food.png"),
  },
  { key: 15, name: "Freeship", source: require("@/assets/icons/Steak.png") },
  { key: 16, name: "Deal 0Đ", source: require("@/assets/icons/tomato.png") },
  { key: 17, name: "Món 1Đ", source: require("@/assets/icons/elipse.png") },
  { key: 18, name: "Ăn chiều", source: require("@/assets/icons/chowmein.png") },
  { key: 19, name: "Combo 199k", source: require("@/assets/icons/Notif.png") },
  { key: 20, name: "Milk Tea", source: require("@/assets/icons/salad.png") },
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
            placeholder="Tìm kiếm cửa hàng..."
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 5 }}
                    source={{
                      uri: `${getUrlBaseBackend()}/images/restaurant/${
                        item.image
                      }`,
                    }}
                  />
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
                ? "Không tìm thấy nhà hàng"
                : "Nhập tên nhà hàng để tìm kiếm"}
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
