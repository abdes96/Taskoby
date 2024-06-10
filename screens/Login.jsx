import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";
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
import { collection, getFirestore, getDocs, addDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const db = getFirestore();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Both fields are required");
      return;
    }
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
        navigation.navigate("CreateFamilyScreen");
      } else {
        console.log("Profiles found.");
      }

      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync(
        {
          projectId: Constants.expoConfig.extra.eas.projectId,
        }
      );

      console.log("Expo push token:", expoPushToken);

      // Save the push token in the user's tokens collection
      const tokensRef = collection(db, "users", user.uid, "tokens");
      await addDoc(tokensRef, { expoPushToken });

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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.bg}>
          <Image
            source={require("../assets/Bonbon2.png")}
            style={styles.bgimgs1}
          />
          <Image
            source={require("../assets/Bonbon3.png")}
            style={styles.bgimgs2}
          />
          <Image
            source={require("../assets/bonbon.png")}
            style={styles.bgimgs3}
          />
          <Image
            source={require("../assets/Bonbon4.png")}
            style={styles.bgimgs4}
          />
          <Image
            source={require("../assets/Bonbon5.png")}
            style={styles.bgimgs5}
          />
          <Image
            source={require("../assets/Bonbon6.png")}
            style={styles.bgimgs6}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.intro}>
            <Text style={styles.title}>Log in</Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins",
              }}
            >
              Welcome back! Please login to your account.
            </Text>
          </View>

          <View style={styles.inputforms}>
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
                  <Ionicons name="eye-off" size={24} color="black" />
                ) : (
                  <Ionicons name="eye" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.LogInBtn} onPress={handleLogin}>
            <Text style={styles.LogText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.signupText1}>Already have an account ? </Text>

            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  content: {
    marginHorizontal: 20,
  },
  inputforms: {},
  LogInBtn: {
    backgroundColor: "#EDE8FF",
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
  },
  LogText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  bgimgs1: {
    width: 120,
    height: 130,
    position: "absolute",
    top: 50,
    right: -60,
  },

  bgimgs2: {
    width: 120,
    height: 130,
    position: "absolute",
    padding: 20,
    left: -30,
    top: 50,
  },
  bgimgs3: {
    width: 130,
    height: 150,
    position: "absolute",
    top: -40,
    left: 150,
  },
  bgimgs4: {
    width: 130,
    height: 150,
    position: "absolute",
    bottom: -50,
    right: -50,
  },
  bgimgs5: {
    width: 100,
    height: 130,
    position: "absolute",
    bottom: 0,
    right: 130,
  },
  bgimgs6: {
    width: 120,
    height: 160,
    position: "absolute",
    bottom: -100,
    left: -70,
  },
  image1: {
    width: 250,
    height: 250,
    position: "absolute",
    top: -20,
    right: 10,
    transform: [{ translateX: 20 }, { translateY: 50 }, { rotate: "-90deg" }],
  },
  intro: {
    paddingBottom: 20,
  },

  title: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    marginBottom: 20,
    color: "#000",
    marginVertical: 12,
    textTransform: "uppercase",
  },

  subtitle: {
    fontSize: 24,
    fontFamily: "Poppins",
    marginBottom: 15,
    color: "#000",
    marginVertical: 12,
  },
  input: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#E9F5FF",
    marginBottom: 20,
    fontSize: 16,
  },
  inputDescription: {
    marginBottom: 4,
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
  },
  password: {
    marginTop: 12,
    position: "absolute",
    right: 12,
  },
  signupLink: {
    marginTop: 30,
    fontSize: 18,
    borderBottomColor: "black",
    borderBottomWidth: 2,
    textAlign: "center",
    fontFamily: "Poppins",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
  },
  signupText: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
  },
  signupText1: {
    fontSize: 18,
    fontFamily: "Poppins",
  },
});

export default Login;
