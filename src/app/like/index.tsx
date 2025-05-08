import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

const Like = () => {
  const navigation: any = useNavigation();
  return (
    <View>
      <Text>Like Component</Text>
      <Button
        title="Like Detail"
        onPress={() => navigation.navigate("LikeDetail")}
      ></Button>
    </View>
  );
};
export default Like;
