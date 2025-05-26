import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { APP_COLOR } from "@/utils/constant";
import { getListArticlesAPI } from "@/utils/api";

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

const pageSizeOptions = [
  { label: "10 Articles", value: 10 },
  { label: "20 Articles", value: 20 },
  { label: "50 Articles", value: 50 },
];

const sortOptions = [
  { label: "Title (A-Z)", field: "title", order: "asc" },
  { label: "Title (Z-A)", field: "title", order: "desc" },
  { label: "Newest First", field: "createdAt", order: "desc" },
  { label: "Oldest First", field: "createdAt", order: "asc" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: APP_COLOR.BLUE,
    marginLeft: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: APP_COLOR.GRAY,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: APP_COLOR.GRAY,
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
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<{ field: string; order: string }>({
    field: "createdAt",
    order: "desc",
  });
  const [modalType, setModalType] = useState<"pageSize" | "sort" | null>(null);

  const fetchArticles = async (pageNum: number = 1, reset: boolean = false) => {
    if (!hasMore && pageNum !== 1 && !reset) return;
    try {
      setLoading(true);
      const sortQuery = sort.order === "desc" ? `-${sort.field}` : sort.field;
      const response = await getListArticlesAPI(pageNum, pageSize, sortQuery);
      console.log("Articles response:", response.data);
      const newArticles = response.data.data.result;
      if (pageNum === 1 || reset) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }
      setHasMore(pageNum < response.data.data.meta.pages);
    } catch (err: any) {
      setError(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1, true);
  }, [pageSize, sort]);

  useEffect(() => {
    if (page > 1) {
      fetchArticles(page);
    }
  }, [page]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
    setHasMore(true);
    setModalType(null);
  };

  const handleSortChange = (field: string, order: string) => {
    setSort({ field, order });
    setPage(1);
    setHasMore(true);
    setModalType(null);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }: { item: IArticle }) => (
    <Pressable
      onPress={() =>
        router.push({
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

  const renderModalItem = ({
    item,
  }: {
    item: { label: string; value?: number; field?: string; order?: string };
  }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() =>
        modalType === "pageSize"
          ? handlePageSizeChange(item.value!)
          : handleSortChange(item.field!, item.order!)
      }
    >
      <Text style={styles.modalItemText}>{item.label}</Text>
    </TouchableOpacity>
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
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalType("pageSize")}
        >
          <Text style={styles.filterButtonText}>{pageSize} Articles</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalType("sort")}
        >
          <Text style={styles.filterButtonText}>
            {sortOptions.find(
              (opt) => opt.field === sort.field && opt.order === sort.order
            )?.label || "Sort"}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
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
      <Modal
        visible={modalType !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalType(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalType(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "pageSize" ? "Articles per Page" : "Sort By"}
            </Text>
            <FlatList
              data={modalType === "pageSize" ? pageSizeOptions : sortOptions}
              renderItem={renderModalItem}
              keyExtractor={(item) => item.label}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default AllArticles;
