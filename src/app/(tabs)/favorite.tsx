import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUserArticleLikes } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

interface ILike {
  _id: string;
  article: {
    _id: string;
    title: string;
    thumbnail?: string;
  };
  quantity: number;
  updatedAt: string;
}

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const maxListHeight = windowHeight * 0.5;

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
    color: APP_COLOR.BLUE,
  },
  listContainer: {
    overflow: "hidden",
  },
  list: {
    marginBottom: 24,
  },
  articleItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  articleThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  articleTitle: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
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
    backgroundColor: APP_COLOR.BLUE,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const FavoriteArticles = () => {
  const [likedArticles, setLikedArticles] = useState<ILike[]>([]);
  const [dislikedArticles, setDislikedArticles] = useState<ILike[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const processLikes = (likes: ILike[]) => {
    const latestLikes: { [articleId: string]: ILike } = {};
    likes.forEach((like) => {
      const articleId = like.article._id;
      if (
        !latestLikes[articleId] ||
        new Date(like.updatedAt) > new Date(latestLikes[articleId].updatedAt)
      ) {
        latestLikes[articleId] = like;
      }
    });
    return Object.values(latestLikes).filter((like) => like.quantity !== 0);
  };

  const fetchUserLikes = async (pageNum: number, isRefresh = false) => {
    try {
      setLoading(!isRefresh);
      const res = await getUserArticleLikes(pageNum, 20);
      console.log("Likes response:-----", res.data.data);
      const likes = processLikes(res.data.data.result);

      if (isRefresh) {
        setLikedArticles(likes.filter((like) => like.quantity === 1));
        setDislikedArticles(likes.filter((like) => like.quantity === -1));
      } else {
        setLikedArticles((prev) => [
          ...prev,
          ...likes.filter((like) => like.quantity === 1),
        ]);
        setDislikedArticles((prev) => [
          ...prev,
          ...likes.filter((like) => like.quantity === -1),
        ]);
      }

      setHasMore(res.data.data.meta.total > pageNum * 20);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load favorite articles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchUserLikes(1, true);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchUserLikes(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading && !refreshing) {
      setPage((prev) => prev + 1);
      fetchUserLikes(page + 1);
    }
  };

  const renderArticleItem = ({ item }: { item: ILike }) => (
    <Pressable
      style={styles.articleItem}
      onPress={() =>
        router.push({
          pathname: "/article/[id]",
          params: { id: item.article._id },
        })
      }
    >
      {item.article.thumbnail && (
        <Image
          source={{ uri: item.article.thumbnail }}
          style={styles.articleThumbnail}
          onError={() =>
            console.log(`Failed to load thumbnail for ${item.article._id}`)
          }
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.article.title}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.updatedAt).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );

  if (loading && page === 1 && !refreshing) {
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
        <Pressable
          style={styles.retryButton}
          onPress={() => fetchUserLikes(1, true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Liked Articles</Text>
        <View style={[styles.listContainer, { maxHeight: maxListHeight }]}>
          <FlatList
            data={likedArticles}
            renderItem={renderArticleItem}
            keyExtractor={(item) => `${item._id}-${item.article._id}`}
            style={styles.list}
            initialNumToRender={10}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No liked articles yet</Text>
            }
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator size="small" color={APP_COLOR.BLUE} />
              ) : null
            }
          />
        </View>
        <Text style={styles.sectionTitle}>Disliked Articles</Text>
        <View style={[styles.listContainer, { maxHeight: maxListHeight }]}>
          <FlatList
            data={dislikedArticles}
            renderItem={renderArticleItem}
            keyExtractor={(item) => `${item._id}-${item.article._id}`}
            style={styles.list}
            initialNumToRender={10}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No disliked articles yet</Text>
            }
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator size="small" color={APP_COLOR.BLUE} />
              ) : null
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FavoriteArticles;
