import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import Signup from "./Signup";

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#CCCCCC",
};

const Welcome = ({ navigation }) => {
  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={require("../assets/hero1.jpg")}
            style={styles.image1}
          />
          <Image
            source={require("../assets/hero3.jpg")}
            style={styles.image2}
          />

          <Image
            source={require("../assets/undraw_mobile_ux_re_59hr 1.png")}
            style={styles.image3}
          />
          <Image
            source={require("../assets/hero2.jpg")}
            style={styles.image4}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Let's Get</Text>
          <Text style={styles.title}>Started</Text>

          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Providing parents with tools for managing tasks and settings.
            </Text>
            <Text style={styles.descriptionText}>
              where families connect, learn, and have fun together through
              engaging activities, rewards, and safe communication features.{" "}
            </Text>
          </View>

          <Button
            title="Join Now"
            onPress={() => navigation.navigate("Signup")}
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account ?</Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginText, styles.loginLink]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    position: "absolute",
    top: 400,
    width: "100%",
  },
  title: {
    fontSize: 50,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  description: {
    marginVertical: 22,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 4,
    fontFamily: "Roboto",
  },
  button: {
    marginTop: 22,
    width: "100%",
    fontFamily: "Roboto",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
  },
  loginText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Roboto",
  },
  loginLink: {
    fontWeight: "bold",
    marginLeft: 4,
    fontFamily: "Roboto",
  },
  image1: {
    height: 100,
    width: 100,
    borderRadius: 20,
    position: "absolute",
    top: 30,
    transform: [{ translateX: 20 }, { translateY: 50 }, { rotate: "-15deg" }],
  },
  image2: {
    height: 100,
    width: 100,
    borderRadius: 20,
    position: "absolute",
    top: 30,
    right: 150,
    transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: "-5deg" }],
  },
  image4: {
    height: 150,
    width: 150,
    borderRadius: 20,
    position: "absolute",
    top: 150,
    left: 0,
    transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: "15deg" }],
  },
  image3: {
    height: 130,
    width: 145,
    borderRadius: 20,
    position: "absolute",
    top: 350,
    right: 100,
    transform: [{ translateX: 50 }, { translateY: 50 }],
  },
});

export default Welcome;
