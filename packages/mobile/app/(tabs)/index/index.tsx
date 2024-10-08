import {StatusView, Feed} from "@/components/UI/home";
import { Colors } from "@/constants/Colors";
import { ScrollView, StyleSheet, StatusBar } from "react-native";

export default function Chats() {
  return (
    <ScrollView style={styles.container}>
      <StatusView />
      <Feed />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Number(StatusBar.currentHeight)+10,
    backgroundColor:Colors["dark"].background,
    flex:1,
  },
  text: {
    color: "#fff",
  },
});
