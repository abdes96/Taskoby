import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { collection , getFirestore , getDocs } from "firebase/firestore";

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#EEEEEE",
};
const db = getFirestore();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const profilesRef = collection(db, "users", user.uid, "profiles");

      // Fetch the profiles
      const profilesSnapshot = await getDocs(profilesRef);

      // Check if there are any profiles
      if (profilesSnapshot.empty) {
        console.log("No profiles found.");
      } else {
        console.log("Profiles found.");
      }

      console.log("User logged in with:", user.email);
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-email":
          Alert.alert("Login Error", "The email address is not valid.");
          break;
        case "auth/invalid-credential":
          Alert.alert(
            "Login Error",
            "The email address or password is not valid."
          );
          break;
        case "auth/user-disabled":
          Alert.alert(
            "Login Error",
            "The user corresponding to the given email has been disabled."
          );
          break;
        case "auth/user-not-found":
          Alert.alert(
            "Login Error",
            "There is no user corresponding to the given email."
          );
          break;
        case "auth/wrong-password":
          Alert.alert(
            "Login Error",
            "The password is invalid for the given email."
          );
          break;
        default:
          Alert.alert("Login Error", error.message);
      }
    }
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.grey, COLORS.grey]}
    >
      <View>
        <Image source={require("../assets/shape.png")} style={styles.image1} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ marginTop: 80, marginHorizontal: 22 }}>
            <Text style={styles.title}>Login</Text>

            <Text
              style={{
                fontSize: 16,
                color: COLORS.black,
                fontFamily: "Poppins",
                fontWeight: "bold",
              }}
            >
              Welcome back! Please login to your account.
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.container}>
              <Text style={styles.subtitle}>Login</Text>

              <Text style={styles.inputDescription}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.inputDescription}>Password</Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!isPasswordShown}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.password}
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                >
                  {isPasswordShown == true ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.black} />
                  )}
                </TouchableOpacity>
              </View>

              <Button
                title="Login"
                onPress={handleLogin}
                style={styles.button}
                bgColor="#62D2C3"
              />

              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>
                  Don't have an account?
                  <Text style={[styles.signupText, styles.signupLink]}>
                    Sign Up
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "start",
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  image1: {
    width: 250,
    height: 250,
    position: "absolute",
    top: -20,
    right: 10,
    transform: [{ translateX: 20 }, { translateY: 50 }, { rotate: "-90deg" }],
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 20,
    color: "#000",
    marginVertical: 12,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 15,
    color: "#000",
    marginVertical: 12,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  inputDescription: {
    marginBottom: 4,
    fontFamily: "Poppins",
    fontSize: 16,
  },
  password: {
    marginTop: 12,
    position: "absolute",
    right: 12,
  },
  signupLink: {
    marginTop: 20,
    fontSize: 18,
    borderBottomColor: "black",
    borderBottomWidth: 2,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  signupText: {
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});

export default Login;
