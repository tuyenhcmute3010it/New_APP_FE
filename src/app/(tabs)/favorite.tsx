import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUrlBaseBackend, getUserLikes } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

const FavoriteTab = () => {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const maxListHeight = windowHeight * 0.5;
  const [likedRestaurants, setLikedRestaurants] = useState<ILike[]>([]);
  const [dislikedRestaurants, setDislikedRestaurants] = useState<ILike[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Deduplicate likes by keeping the latest interaction per restaurant
  const processLikes = (likes: ILike[]) => {
    const latestLikes: { [restaurantId: string]: ILike } = {};
    likes.forEach((like) => {
      const restaurantId = like.restaurant._id;
      if (
        !latestLikes[restaurantId] ||
        new Date(like.updatedAt) > new Date(latestLikes[restaurantId].updatedAt)
      ) {
        latestLikes[restaurantId] = like;
      }
    });
    return Object.values(latestLikes);
  };

  // Fetch user likes
  const fetchUserLikes = async (pageNum: number, isRefresh = false) => {
    try {
      setLoading(true);
      const res = await getUserLikes(pageNum, 20);
      const likes = processLikes(res.data.data.result);

      if (isRefresh) {
        // Clear existing data on refresh
        setLikedRestaurants(likes.filter((like) => like.quantity === 1));
        setDislikedRestaurants(likes.filter((like) => like.quantity === -1));
      } else {
        // Append data for pagination
        setLikedRestaurants((prev) => [
          ...prev,
          ...likes.filter((like) => like.quantity === 1),
        ]);
        setDislikedRestaurants((prev) => [
          ...prev,
          ...likes.filter((like) => like.quantity === -1),
        ]);
      }

      if (likes.length < 20) setHasMore(false);
    } catch (err: any) {
      setError(err.message || "Failed to load favorite restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLikes(page);
  }, [page]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1); // Reset to first page
    setHasMore(true); // Reset hasMore
    await fetchUserLikes(1, true); // Fetch with refresh flag
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasMore && !loading && !refreshing) setPage((prev) => prev + 1);
  };

  // Render a restaurant item
  const renderRestaurantItem = ({ item }: { item: ILike }) => (
    <Pressable
      style={styles.restaurantItem}
      onPress={() =>
        router.navigate({
          pathname: "/product/[id]",
          params: { id: item.restaurant._id },
        })
      }
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <View>
          <Image
            source={{
              uri: `${getUrlBaseBackend()}/images/restaurant/${
                item.restaurant.image
              }`,
            }}
            style={{ width: 60, height: 60 }}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (loading && page === 1 && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={APP_COLOR.GRAY} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchUserLikes(1)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Liked Article</Text>
        <View style={[styles.listContainer, { maxHeight: maxListHeight }]}>
          <FlatList
            data={likedRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => `${item._id}-${item.restaurant._id}`} // Ensure unique keys
            style={styles.list}
            initialNumToRender={10}
            windowSize={5}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No liked Article</Text>
            }
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator size="small" color={APP_COLOR.GRAY} />
              ) : null
            }
          />
        </View>
        <Text style={styles.sectionTitle}>Disliked Article</Text>
        <View style={[styles.listContainer, { maxHeight: maxListHeight }]}>
          <FlatList
            data={dislikedRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => `${item._id}-${item.restaurant._id}`} // Ensure unique keys
            style={styles.list}
            initialNumToRender={10}
            windowSize={5}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No disliked Article</Text>
            }
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator size="small" color={APP_COLOR.GRAY} />
              ) : null
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: APP_COLOR.GRAY,
  },
  listContainer: {
    overflow: "hidden", // Ensures content is clipped within bounds
  },
  list: {
    marginBottom: 24,
  },
  restaurantItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLOR.GREY,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restaurantName: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: APP_COLOR.GREY,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    color: APP_COLOR.BLUE,
  },
  emptyText: {
    fontSize: 16,
    color: APP_COLOR.GREY,
    textAlign: "center",
    marginVertical: 16,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: APP_COLOR.GRAY,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FavoriteTab;
