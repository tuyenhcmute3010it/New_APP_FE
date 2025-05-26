// src/app/articles/page.tsx
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { APP_COLOR } from "@/utils/constant";
import { getArticlesAPI } from "@/utils/api";

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
  item: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: APP_COLOR.GRAY,
  },
  description: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  author: {
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
});

const AllArticles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (pageNum: number = 1) => {
    if (!hasMore && pageNum !== 1) return;
    try {
      const response = await getArticlesAPI(pageNum, 10);
      const newArticles = response.data.data.result;
      if (pageNum === 1) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }
      setHasMore(pageNum < response.data.data.meta.pages);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to load articles");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchArticles(nextPage);
        return nextPage;
      });
    }
  };

  const renderItem = ({ item }: { item: IArticle }) => (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/article/[id]",
          params: { id: item._id },
        })
      }
    >
      <View style={styles.item}>
        {item.thumbnail ? (
          <Image
            style={styles.thumbnail}
            source={{ uri: item.thumbnail }}
            onError={() =>
              console.log(`Failed to load thumbnail for ${item._id}`)
            }
          />
        ) : (
          <View style={[styles.thumbnail, { backgroundColor: "#ddd" }]} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.content.substring(0, 100) +
              (item.content.length > 100 ? "..." : "")}
          </Text>
          <Text style={styles.author}>By {item.author.name}</Text>
        </View>
      </View>
    </Pressable>
  );

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
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="large" color={APP_COLOR.BLUE} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.error}>No articles found</Text> : null
        }
      />
    </SafeAreaView>
  );
};

export default AllArticles;
