// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Pressable,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import Toast from "react-native-root-toast";
// import {
//   getArticleById,
//   likedArticle,
//   getArticleLikeStatus,
// } from "@/utils/api";
// import { APP_COLOR } from "@/utils/constant";

// interface IArticle {
//   _id: string;
//   title: string;
//   content: string;
//   thumbnail: string;
//   author: {
//     _id: string;
//     name: string;
//     email: string;
//     avatar?: string;
//   };
//   createdBy: {
//     _id: string;
//     email: string;
//   };
//   isDeleted: boolean;
//   deletedAt: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },
//   thumbnail: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: APP_COLOR.GRAY,
//     marginBottom: 10,
//   },
//   content: {
//     fontSize: 16,
//     color: "#333",
//     lineHeight: 24,
//     marginBottom: 10,
//   },
//   authorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   authorAvatar: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginRight: 8,
//   },
//   author: {
//     fontSize: 14,
//     color: "#999",
//   },
//   date: {
//     fontSize: 12,
//     color: "#999",
//     marginBottom: 10,
//   },
//   likeContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginVertical: 10,
//   },
//   error: {
//     fontSize: 16,
//     color: "red",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   navContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//   },
// });

// const ArticleDetail = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [article, setArticle] = useState<IArticle | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isLiked, setIsLiked] = useState<boolean>(false);
//   const [isDisliked, setIsDisliked] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchArticleAndLikeStatus = async () => {
//       if (!id) {
//         setError("Invalid article ID");
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log(`Fetching data for article ID: ${id}`);
//         const [articleResponse, likeResponse] = await Promise.all([
//           getArticleById(id as string),
//           getArticleLikeStatus(id as string),
//         ]);

//         console.log("Article response:", articleResponse.data);
//         console.log("Like response:", likeResponse.data.data.data);

//         setArticle(articleResponse.data.data.data);

//         const quantity = likeResponse.data.data.data?.quantity ?? 0;
//         setIsLiked(quantity === 1);
//         setIsDisliked(quantity === -1);
//         console.log(
//           `Set isLiked: ${quantity === 1}, isDisliked: ${
//             quantity === -1
//           } (quantity: ${quantity})`
//         );

//         setLoading(false);
//       } catch (err: any) {
//         console.error("Fetch error:", err);
//         setError(err.message || "Failed to load article or like status");
//         setLoading(false);
//       }
//     };

//     fetchArticleAndLikeStatus();
//   }, [id]);

//   const handleLike = async () => {
//     try {
//       const newQuantity = isLiked ? -1 : isDisliked ? 0 : 1;
//       console.log(
//         `Updating article ${id} like status, newQuantity: ${newQuantity}`
//       );
//       const res = await likedArticle(id as string, newQuantity);
//       if (res.data.data) {
//         const newIsLiked = newQuantity === 1;
//         const newIsDisliked = newQuantity === -1;
//         setIsLiked(newIsLiked);
//         setIsDisliked(newIsDisliked);
//         console.log(
//           `Updated isLiked: ${newIsLiked}, isDisliked: ${newIsDisliked}`
//         );
//         Toast.show(
//           newIsLiked
//             ? "Article liked!"
//             : newIsDisliked
//             ? "Article disliked!"
//             : "Like/Dislike removed!",
//           {
//             duration: Toast.durations.LONG,
//             textColor: "white",
//             backgroundColor: newIsLiked
//               ? APP_COLOR.ORANGE || "red"
//               : newIsDisliked
//               ? APP_COLOR.BLUE || "blue"
//               : APP_COLOR.GREY || "grey",
//             opacity: 1,
//           }
//         );
//       }
//     } catch (error: any) {
//       console.error("Failed to update article like:", error);
//       const msg =
//         error.message ||
//         `Failed to ${
//           isLiked ? "dislike" : isDisliked ? "remove like/dislike" : "like"
//         } article.`;
//       Toast.show(msg, {
//         duration: Toast.durations.LONG,
//         textColor: "white",
//         backgroundColor: APP_COLOR.ORANGE || "orange",
//         opacity: 1,
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" color={APP_COLOR.BLUE} />
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.error}>{error}</Text>
//       </SafeAreaView>
//     );
//   }

//   if (!article) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.error}>Article not found</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.navContainer}>
//           <Pressable onPress={() => router.back()}>
//             <Text style={{ color: APP_COLOR.BLUE, fontSize: 16 }}>Back</Text>
//           </Pressable>
//           <Pressable onPress={() => router.navigate("/favorites")}>
//             <Text style={{ color: APP_COLOR.BLUE, fontSize: 16 }}>
//               View Favorites
//             </Text>
//           </Pressable>
//         </View>
//         {article.thumbnail && (
//           <Image
//             style={styles.thumbnail}
//             source={{ uri: article.thumbnail }}
//             onError={() => console.log("Failed to load thumbnail")}
//           />
//         )}
//         <Text style={styles.title}>{article.title}</Text>
//         <Text style={styles.content}>{article.content}</Text>
//         <View style={styles.authorContainer}>
//           {article.author.avatar && (
//             <Image
//               style={styles.authorAvatar}
//               source={{ uri: article.author.avatar }}
//               onError={() => console.log("Failed to load author avatar")}
//             />
//           )}
//           <Text style={styles.author}>By {article.author.name}</Text>
//         </View>
//         <Text style={styles.date}>
//           Published on {new Date(article.createdAt).toLocaleDateString()}
//         </Text>
//         <View style={styles.likeContainer}>
//           <MaterialIcons
//             onPress={handleLike}
//             name={
//               isLiked
//                 ? "favorite"
//                 : isDisliked
//                 ? "thumb-down"
//                 : "favorite-outline"
//             }
//             size={20}
//             color={
//               isLiked
//                 ? APP_COLOR.ORANGE || "red"
//                 : isDisliked
//                 ? APP_COLOR.BLUE || "blue"
//                 : APP_COLOR.GREY || "grey"
//             }
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ArticleDetail;

// src/app/article/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-root-toast";
import {
  getArticleById,
  likedArticle,
  getArticleLikeStatus,
} from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

interface IArticle {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdBy: {
    _id: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: APP_COLOR.GRAY,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 10,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  author: {
    fontSize: 14,
    color: "#999",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  likeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

const ArticleDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticleAndLikeStatus = async () => {
      if (!id) {
        setError("Invalid article ID");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching data for article ID: ${id}`);
        const [articleResponse, likeResponse] = await Promise.all([
          getArticleById(id as string),
          getArticleLikeStatus(id as string),
        ]);

        console.log("Article response:", articleResponse.data);
        console.log("Like response:", likeResponse.data);

        setArticle(articleResponse.data.data.data);
        const quantity = likeResponse.data.data.data?.quantity ?? 0;
        setIsLiked(quantity === 1);
        setIsDisliked(quantity === -1);
        console.log(
          `Set isLiked: ${quantity === 1}, isDisliked: ${
            quantity === -1
          } (quantity: ${quantity})`
        );

        setLoading(false);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load article or like status");
        setLoading(false);
      }
    };

    fetchArticleAndLikeStatus();
  }, [id]);

  const handleLike = async () => {
    try {
      // Toggle between like (1) and dislike (-1)
      const newQuantity = isLiked ? -1 : 1;
      console.log(
        `Updating article ${id} like status, newQuantity: ${newQuantity}`
      );
      const res = await likedArticle(id as string, newQuantity);
      if (res.data.data) {
        const newIsLiked = newQuantity === 1;
        const newIsDisliked = newQuantity === -1;
        setIsLiked(newIsLiked);
        setIsDisliked(newIsDisliked);
        console.log(
          `Updated isLiked: ${newIsLiked}, isDisliked: ${newIsDisliked}`
        );
        Toast.show(newIsLiked ? "Article liked!" : "Article disliked!", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: newIsLiked
            ? APP_COLOR.ORANGE || "red"
            : APP_COLOR.BLUE || "blue",
          opacity: 1,
        });
      }
    } catch (error: any) {
      console.error("Failed to update article like:", error);
      const msg =
        error.message || `Failed to ${isLiked ? "dislike" : "like"} article.`;
      Toast.show(msg, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.ORANGE || "orange",
        opacity: 1,
      });
    }
  };

  if (loading) {
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

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Article not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.navContainer}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: APP_COLOR.BLUE, fontSize: 16 }}>Back</Text>
          </Pressable>
          <Pressable onPress={() => router.navigate("/favorites")}>
            <Text style={{ color: APP_COLOR.BLUE, fontSize: 16 }}>
              View Favorites
            </Text>
          </Pressable>
        </View>

        {article.thumbnail && (
          <Image
            style={styles.thumbnail}
            source={{ uri: article.thumbnail }}
            onError={() => console.log("Failed to load thumbnail")}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.title}>{article.title}</Text>
          </View>
          <View>
            <MaterialIcons
              onPress={handleLike}
              name={
                isLiked
                  ? "favorite"
                  : isDisliked
                  ? "thumb-down"
                  : "favorite-outline"
              }
              size={20}
              color={
                isLiked
                  ? APP_COLOR.RED || "red"
                  : isDisliked
                  ? APP_COLOR.BLUE || "blue"
                  : APP_COLOR.GREY || "grey"
              }
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.authorContainer}>
            {article.author.avatar && (
              <Image
                style={styles.authorAvatar}
                source={{ uri: article.author.avatar }}
                onError={() => console.log("Failed to load author avatar")}
              />
            )}
            <Text style={styles.author}>By {article.author.name}</Text>
          </View>
          <Text style={styles.date}>
            Published on {new Date(article.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleDetail;
