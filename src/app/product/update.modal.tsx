import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import { APP_COLOR } from "@/utils/constant";
import { useCurrentApp } from "@/context/app.context";
import { useEffect, useState } from "react";
import { currencyFormatter, getUrlBaseBackend } from "@/utils/api";
import Feather from "@expo/vector-icons/Feather";

interface IUpdatedItem {
  image: string;
  title: string;
  option: string;
  price: number;
  quantity: number;
}

const UpdateModalPage = () => {
  const { restaurant, cart, setCart } = useCurrentApp();
  const { menuItemId } = useLocalSearchParams();
  const [menuItem, setMenuItem] = useState<IMenuItem | null>(null);
  const [updatedItems, setUpdatedItems] = useState<IUpdatedItem[]>([]);

  useEffect(() => {
    if (restaurant && menuItemId) {
      for (let i = 0; i < restaurant.data.menu.length; i++) {
        const menu = restaurant.data.menu[i];
        let found = false;
        for (let j = 0; j < menu.menuItem.length; j++) {
          if (menu.menuItem[j]._id === menuItemId) {
            found = true;
            setMenuItem(menu.menuItem[j]);
            break;
          }
        }
        if (found) break;
      }
    }
  }, [restaurant, menuItemId]);

  useEffect(() => {
    if (menuItem && restaurant) {
      const currentItem = cart[restaurant.data._id]?.items[menuItem._id];
      if (currentItem?.extra) {
        const temp: IUpdatedItem[] = [];
        for (const [key, quantity] of Object.entries(currentItem.extra)) {
          const option = menuItem.options?.find(
            (item) => `${item.title}-${item.description}` === key
          );
          if (option) {
            const price = menuItem.basePrice + option.additionalPrice;
            temp.push({
              image: menuItem.image,
              title: menuItem.title,
              option: key,
              price,
              quantity,
            });
          }
        }
        setUpdatedItems(temp);
      }
    }
  }, [menuItem]);

  const handlePressItem = (item: IUpdatedItem, action: "MINUS" | "PLUS") => {
    const foundIndex = updatedItems.findIndex((x) => x.option === item.option);
    if (foundIndex === -1) return;

    const newItems = [...updatedItems];
    const currentItem = newItems[foundIndex];
    if (action === "PLUS") {
      currentItem.quantity += 1;
    } else {
      currentItem.quantity -= 1;
    }

    if (currentItem.quantity <= 0) {
      newItems.splice(foundIndex, 1); // remove item nếu quantity <= 0
    }

    setUpdatedItems(newItems);
  };

  const handleUpdateCart = () => {
    if (!restaurant?.data._id || !menuItem) return;

    const restaurantId = restaurant.data._id;
    const itemId = menuItem._id;

    if (!cart[restaurantId]) return;

    let newSum = 0;
    let newQuantity = 0;
    const newExtra: { [key: string]: number } = {};

    updatedItems.forEach((item) => {
      newSum += item.price * item.quantity;
      newQuantity += item.quantity;
      newExtra[item.option] = item.quantity;
    });

    if (newQuantity > 0) {
      cart[restaurantId].items[itemId] = {
        data: menuItem,
        quantity: newQuantity,
        extra: newExtra,
      };
    } else {
      delete cart[restaurantId].items[itemId];
    }

    cart[restaurantId].sum = Object.values(cart[restaurantId].items).reduce(
      (acc, curr) => {
        let itemSum = curr.data.basePrice * curr.quantity;
        if (curr.extra) {
          for (const [key, qty] of Object.entries(curr.extra)) {
            const option = curr.data.options?.find(
              (opt) => `${opt.title}-${opt.description}` === key
            );
            if (option) {
              itemSum += option.additionalPrice * qty;
            }
          }
        }
        return acc + itemSum;
      },
      0
    );

    cart[restaurantId].quantity = Object.values(
      cart[restaurantId].items
    ).reduce((acc, curr) => acc + curr.quantity, 0);

    setCart((prev: any) => ({ ...prev, cart }));
    router.back();
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#00000040",
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={SlideInDown}
        style={{
          height: "80%",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            borderBottomColor: "#eee",
            borderBottomWidth: 1,
            flexDirection: "row",
            gap: 10,
            padding: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Cập nhật món
            </Text>
          </View>
          <AntDesign
            onPress={() => router.back()}
            name="close"
            size={24}
            color="grey"
          />
        </View>

        <ScrollView style={{ flex: 1 }}>
          {updatedItems.map((item, index) => (
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
                <View>
                  <Image
                    source={{
                      uri: `${getUrlBaseBackend()}/images/menu-item/${
                        item.image
                      }`,
                    }}
                    style={{ width: 60, height: 60, borderRadius: 5 }}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 16 }}>{item.title}</Text>
                  <Text style={{ fontWeight: "600" }}>{item.option}</Text>
                  <Text style={{ color: APP_COLOR.GRAY }}>
                    {currencyFormatter(item.price)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => handlePressItem(item, "MINUS")}
                  style={{
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: APP_COLOR.GRAY,
                    borderRadius: 3,
                    padding: 4,
                    marginHorizontal: 5,
                  }}
                >
                  <Feather name="minus" size={16} color={APP_COLOR.GRAY} />
                </Pressable>
                <Text style={{ minWidth: 20, textAlign: "center" }}>
                  {item.quantity}
                </Text>
                <Pressable
                  onPress={() => handlePressItem(item, "PLUS")}
                  style={{
                    backgroundColor: APP_COLOR.GRAY,
                    borderRadius: 3,
                    padding: 5,
                    marginHorizontal: 5,
                  }}
                >
                  <Feather name="plus" size={16} color="white" />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>

        <View
          style={{
            marginBottom: 20,
            marginTop: 10,
            marginHorizontal: 10,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={handleUpdateCart}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              padding: 10,
              backgroundColor: APP_COLOR.GRAY,
              borderRadius: 3,
            })}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              Cập nhật giỏ hàng
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default UpdateModalPage;
