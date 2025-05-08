import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import popupImg from "@/assets/thetokyoTimePopUp.png";

const PopupSalePage = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "transparent", // Ensure transparency
      }}
    >
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)", // Slightly darker for visibility
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000, // Ensure modal is above other content
        }}
        onTouchEnd={() => router.back()} // Dismiss on background tap
      >
        <Animated.View
          entering={SlideInDown.duration(500).springify()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundColor: "transparent", // Ensure inner view is transparent
            zIndex: 1001, // Ensure content is above background
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "white",
              height: 26,
              width: 26,
              borderRadius: 13,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: -20,
              right: -20,
              zIndex: 1002, // Ensure button is clickable
            }}
          >
            <AntDesign name="close" size={22} color="grey" />
          </TouchableOpacity>
          <Image
            source={popupImg}
            style={{
              height: 400,
              width: 350,
            }}
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default PopupSalePage;
