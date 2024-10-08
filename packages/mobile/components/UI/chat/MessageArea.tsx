import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const MessageArea = () => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let timerId = setTimeout(()=>{
        inputRef.current?.focus();
    }, 1000)

    return ()=> clearTimeout(timerId);
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity>
            <Feather name="paperclip" size={20} color={Colors["dark"].icon} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            ref={inputRef}
            placeholder="Type something..."
            placeholderTextColor={Colors["dark"].icon}
          />
          <TouchableOpacity>
            <Feather name="mic" size={20} color={Colors["dark"].icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendBtn}>
          <Feather name="send" size={20} color={Colors["dark"].text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageArea;

const styles = StyleSheet.create({
  container: {
    width: "92%",
    marginVertical: 5,
    paddingVertical: 5,
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    height: 50,
    backgroundColor: Colors["dark"].background,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 60,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    paddingHorizontal: 0,
    color: Colors["dark"].text,
    fontSize: 18,
  },
  sendBtn: {
    padding: 12,
    backgroundColor: Colors["dark"].tint,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
