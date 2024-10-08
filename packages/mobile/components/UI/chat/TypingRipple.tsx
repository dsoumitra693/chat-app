import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

const TypingRipple = ({name}:{name:string}) => {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  const containerTranslateY = useRef(new Animated.Value(10)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  const [typingText, setTypingText] = useState("is typing");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(containerTranslateY, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const startRippleAnimation = (
      ripple: Animated.Value | Animated.ValueXY
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(ripple, {
            toValue: -3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(ripple, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startRippleAnimation(ripple1);
    let timeout1 = setTimeout(() => startRippleAnimation(ripple2), 200);
    let timeout2 = setTimeout(() => startRippleAnimation(ripple3), 400);

    const _typingText = "....";
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypingText(_typingText.slice(0, index));
      index = (index + 1) % _typingText.length;
    }, 1000 / _typingText.length);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: containerTranslateY }],
          opacity: containerOpacity,
        },
      ]}
    >
      <View style={styles.rippleWrapper}>
        <Animated.View
          style={[styles.ripple, { transform: [{ translateY: ripple1 }] }]}
        />
        <Animated.View
          style={[styles.ripple, { transform: [{ translateY: ripple2 }] }]}
        />
        <Animated.View
          style={[styles.ripple, { transform: [{ translateY: ripple3 }] }]}
        />
      </View>
      <Text style={styles.textPrimary}>{name} </Text>
      <Text style={styles.textSecondary}>is typing{typingText}</Text>
    </Animated.View>
  );
};

export default TypingRipple;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop:20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textPrimary: {
    color: Colors["dark"].text,
    fontSize: 16,
  },
  textSecondary: {
    color: Colors["dark"].text2,
    fontSize: 16,
  },
  rippleWrapper: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  ripple: {
    width: 5,
    aspectRatio: 1,
    borderRadius: 5,
    backgroundColor: Colors["dark"].tint,
  },
});
