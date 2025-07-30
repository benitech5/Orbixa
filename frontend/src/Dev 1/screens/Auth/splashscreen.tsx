import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";

const SplashScreen = ({ navigation }: any) => {
  const [showLogo, setShowLogo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Show black screen for 1 second
    const blackTimeout = setTimeout(() => {
      setShowLogo(true);
      // Fade in logo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Navigate to Onboarding after 3 seconds total
    const navTimeout = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 3000);

    return () => {
      clearTimeout(blackTimeout);
      clearTimeout(navTimeout);
    };
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      {!showLogo ? (
        <View style={styles.blackScreen} />
      ) : (
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Image
            source={require("../../../assets/avatars/everything/orbixa.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  blackScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

export default SplashScreen;