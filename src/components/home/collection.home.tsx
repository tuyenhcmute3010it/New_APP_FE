// src/components/home/collection.home.tsx
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { useState } from "react";
import { router } from "expo-router";
import ContentLoader, { Rect } from "react-content-loader/native";

const { width: sWidth } = Dimensions.get("window");

interface IProps {
  name: string;
  description: string;
  refAPI: string;
  thumbnail: string;
}

const styles = StyleSheet.create({
  item: {
    borderColor: "#ccc",
    borderWidth: 1,
    height: 250,
    marginBottom: 10,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnail: {
    height: 120,
    width: 120,
    borderRadius: 8,
  },
  tag: {
    borderRadius: 4,
    borderColor: APP_COLOR.BLUE,
    padding: 4,
    borderWidth: 1,
  },
  tagName: {
    color: APP_COLOR.BLUE,
    fontSize: 12,
  },
});

const CollectionHome = (props: IProps) => {
  const { name, description, refAPI, thumbnail } = props;
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Extract article ID from refAPI
  const articleId = refAPI.split("article-")[1];

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/article/[id]",
          params: { id: articleId },
        })
      }
    >
      {loading ? (
        <ContentLoader
          speed={2}
          width={sWidth}
          height={230}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          style={{ width: "100%" }}
        >
          <Rect x="10" y="10" rx="5" ry="5" width={150} height="200" />
        </ContentLoader>
      ) : (
        <View style={styles.item}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                color: APP_COLOR.GRAY,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {name}
            </Text>
            <Pressable onPress={() => router.navigate("/articles")}>
              <Text
                style={{
                  color: APP_COLOR.GRAY,
                  fontWeight: "500",
                  fontSize: 13,
                }}
              >
                See All
              </Text>
            </Pressable>
          </View>
          <View>
            <Text
              style={{ fontSize: 12, color: "#999" }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          </View>
          <View style={{ padding: 5, flexDirection: "row", gap: 10 }}>
            <Image
              style={styles.thumbnail}
              source={{ uri: thumbnail || "https://via.placeholder.com/120" }}
              onError={() => console.log("Failed to load thumbnail")}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  maxWidth: sWidth - 150,
                  height: 40,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
              <View style={{ flexDirection: "row", gap: 5, marginTop: 5 }}>
                <View style={styles.tag}>
                  <Text style={styles.tagName}>Featured</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagName}>New</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default CollectionHome;
