import ShareInput from "@/components/input/share.input";
import { useCurrentApp } from "@/context/app.context";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#ff6200",
    padding: 20,
    alignItems: "center",
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  logoutButton: {
    backgroundColor: APP_COLOR.GRAY,
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    flexDirection: "row",
    gap: 10,
  },
});

const AccountTab = () => {
  const { theme, appState } = useCurrentApp();
  const backend =
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_ANDROID_API_URL
      : process.env.EXPO_PUBLIC_IOS_API_URL;
  const avatarDefault = `${backend}/images/avatar/`;
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          await AsyncStorage.removeItem("access_token");
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{ uri: `${avatarDefault}${appState?.data.user?.avatar}` }}
        />
        <Text style={styles.username}>{appState?.data.user?.name}</Text>
      </View>

      <View style={{ flex: 1, marginTop: 10 }}>
        <Pressable
          style={styles.menuItem}
          onPress={() => router.navigate("/(user)/account/user.info")}
        >
          <View style={styles.info}>
            <View>
              <MaterialCommunityIcons
                name="account-check"
                size={24}
                color="blue"
              />
            </View>
            <Text style={styles.menuText}>Update Information</Text>
          </View>

          <View>
            <Entypo name="chevron-right" size={24} color="#ccc" />
          </View>
        </Pressable>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.navigate("/(user)/account/user.password")}
        >
          <View style={styles.info}>
            <View>
              <MaterialIcons name="password" size={24} color="blue" />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
          </View>
          <View>
            <Entypo name="chevron-right" size={24} color="#ccc" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.info}>
            <View>
              <FontAwesome name="language" size={24} color="blue" />
            </View>
            <Text style={styles.menuText}>Language</Text>
          </View>
          <View>
            <Entypo name="chevron-right" size={24} color="#ccc" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.info}>
            <View>
              <AntDesign name="infocirlceo" size={24} color="blue" />
            </View>
            <Text style={styles.menuText}>About App</Text>
          </View>
          <View>
            <Entypo name="chevron-right" size={24} color="#ccc" />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountTab;
