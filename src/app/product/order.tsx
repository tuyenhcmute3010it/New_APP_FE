import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { useCurrentApp } from "@/context/app.context";
import { useEffect, useState } from "react";
import {
  getUrlBaseBackend,
  currencyFormatter,
  placeOrderAPI,
} from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import Animated, { FadeIn } from "react-native-reanimated";
import Toast from "react-native-root-toast";
import { ro } from "@faker-js/faker/.";
import { router } from "expo-router";

interface IOrderItem {
  image: string;
  title: string;
  option: string;
  price: number;
  quantity: number;
}

const OrderPage = () => {
  const { restaurant, cart, setCart } = useCurrentApp();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "cash">("cash");

  const handelPlaceOrder = async () => {
    const data = {
      restaurant: restaurant?.data._id,
      totalPrice: cart?.[restaurant!.data._id].sum,
      totalQuantity: cart?.[restaurant!.data._id].quantity,

      detail: orderItems,
    };
    const res = await placeOrderAPI(data);
    if (res.data) {
      Toast.show("Order Successfully", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.GRAY,
        opacity: 1,
      });
      setCart((prevCart: any) => ({
        ...prevCart,
        [restaurant!.data._id]: { items: {}, quantity: 0, sum: 0 },
      }));
      router.navigate("/");

      //
    } else {
      //error
      const msg: any = Array.isArray(res.message)
        ? res.message[0]
        : res.message;

      Toast.show(msg, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.GRAY,
        opacity: 1,
      });
    }
  };
  useEffect(() => {
    if (restaurant && cart && restaurant.data._id) {
      const result: IOrderItem[] = [];
      const cartItems = cart[restaurant.data._id]?.items;

      for (const [menuItemId, currentItem] of Object.entries(cartItems)) {
        if (currentItem.extra) {
          for (const [key, qty] of Object.entries(currentItem.extra)) {
            const option = currentItem.data.options?.find(
              (item) => `${item.title}-${item.description}` === key
            );
            const addPrice = option?.additionalPrice ?? 0;
            result.push({
              image: currentItem.data.image,
              title: currentItem.data.title,
              option: key,
              price: currentItem.data.basePrice + addPrice,
              quantity: qty,
            });
          }
        } else {
          result.push({
            image: currentItem.data.image,
            title: currentItem.data.title,
            option: "",
            price: currentItem.data.basePrice,
            quantity: currentItem.quantity,
          });
        }
      }
      setOrderItems(result);
    }
  }, [restaurant, cart]);

  const totalQuantity =
    (restaurant && cart?.[restaurant?.data._id || ""]?.quantity) || 0;
  const totalSum = (restaurant && cart?.[restaurant?.data._id || ""]?.sum) || 0;

  return (
    <Animated.View
      entering={FadeIn}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          padding: 10,
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          Đơn hàng của bạn
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {orderItems.map((item, index) => (
          <View
            key={index}
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
              />
              <View>
                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                {item.option ? (
                  <Text style={{ fontWeight: "600", color: APP_COLOR.GREY }}>
                    {item.option}
                  </Text>
                ) : null}
                <Text style={{ color: APP_COLOR.GRAY }}>
                  {currencyFormatter(item.price)}
                </Text>
              </View>
            </View>

            <View>
              <Text style={{ fontWeight: "600" }}>x{item.quantity}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Thanh toán */}
      {orderItems.length > 0 && restaurant && (
        <View
          style={{ padding: 15, borderTopWidth: 1, borderTopColor: "#eee" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: APP_COLOR.GREY }}>
              Tổng ({totalQuantity} món)
            </Text>
            <Text style={{ fontWeight: "600", fontSize: 16 }}>
              {currencyFormatter(totalSum)}
            </Text>
          </View>

          {/* Phương thức thanh toán */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
            <Pressable
              onPress={() => setPaymentMethod("paypal")}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor:
                  paymentMethod === "paypal" ? APP_COLOR.GRAY : "#ccc",
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor:
                  paymentMethod === "paypal" ? "#ffece1" : "#fff",
                alignItems: "center",
              }}
            >
              <Text>Ví PayPal</Text>
            </Pressable>

            <Pressable
              onPress={() => setPaymentMethod("cash")}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: paymentMethod === "cash" ? APP_COLOR.GRAY : "#ccc",
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: paymentMethod === "cash" ? "#ffece1" : "#fff",
                alignItems: "center",
              }}
            >
              <Text>Tiền mặt</Text>
            </Pressable>
          </View>

          {/* Nút đặt đơn */}
          <Pressable
            style={{
              backgroundColor: APP_COLOR.GRAY,
              paddingVertical: 15,
              borderRadius: 5,
              alignItems: "center",
            }}
            onPress={handelPlaceOrder}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Order - {currencyFormatter(totalSum)}
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};

export default OrderPage;
