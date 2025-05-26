import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { APP_COLOR } from "@/utils/constant";
import { getRecentArticles } from "@/utils/api";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
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
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: APP_COLOR.GRAY,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

const NotificationTab = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (isRefresh: boolean = false) => {
    try {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);
      const response = await getRecentArticles(20);
      setArticles(response.data.data.result);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    await fetchNotifications(true);
  };

  const renderNotification = ({ item }: { item: IArticle }) => (
    <Pressable
      style={styles.notificationItem}
      onPress={() =>
        router.push({
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
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          New Article: {item.title}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={APP_COLOR.BLUE} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No new articles</Text>
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="large" color={APP_COLOR.BLUE} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default NotificationTab;
