import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { APP_COLOR } from "@/utils/constant";
import {
  currencyFormatter,
  getOrderHistoryAPI,
  getUrlBaseBackend,
} from "@/utils/api";
import { SafeAreaView } from "react-native-safe-area-context";

// Interface for the API response structure
interface IBackendRes<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Interface for order history to match the API response

const OrderTab = () => {
  const [orders, setOrders] = useState<IOrderHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order history on component mount
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        // Remove unnecessary data parameter
        const res = await getOrderHistoryAPI({});
        if (res.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        } else {
          setError("No orders found.");
        }
      } catch (err: any) {
        setError(`Failed to fetch order history: ${err.message || err}`);
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Render each order item
  const renderOrderItem = (item: IOrderHistory["detail"][0], index: number) => (
    <View
      key={item._id || index} // Use item._id for uniqueness, fallback to index
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Image
          source={{
            uri: `${getUrlBaseBackend()}/images/menu-item/${item.image}`,
          }}
          style={{ width: 60, height: 60, borderRadius: 5 }}
          onError={() => console.log(`Failed to load image: ${item.image}`)}
        />
        <View>
          <Text style={{ fontSize: 16 }}>{item.title}</Text>
          {item.option ? (
            <Text style={{ fontWeight: "600" }}>{item.option}</Text>
          ) : null}
          <Text style={{ color: APP_COLOR.GRAY }}>
            {currencyFormatter(item.price)} x {item.quantity}
          </Text>
        </View>
      </View>
    </View>
  );

  // Render each order
  const renderOrder = (order: IOrderHistory) => (
    <View
      key={order._id}
      style={{
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eee",
      }}
    >
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            Order ID: {order._id.slice(-6)}
          </Text>
          <Text style={{ color: "grey" }}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </View>
        <Text style={{ color: APP_COLOR.GRAY, fontWeight: "600" }}>
          {currencyFormatter(order.totalPrice)}
        </Text>
      </View>
      {order.detail.map(renderOrderItem)}
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "600" }}>
          Total Items: {order.totalQuantity}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "600", color: "GRAY" }}>
          {currencyFormatter(order.totalPrice)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={APP_COLOR.GRAY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            Order History
          </Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          {orders.length > 0 ? (
            orders.map(renderOrder)
          ) : (
            <View style={styles.centered}>
              <Text>No orders found.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderTab;
