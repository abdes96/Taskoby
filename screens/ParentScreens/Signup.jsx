import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import { Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
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

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleRegister = async () => {
    const nameRegex = /^[a-zA-Z-' ]+$/;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
      Alert.alert("Error", "First name and last name should only contain letters, hyphens, apostrophes, and spaces");
      return;
    }

    if (!isChecked) {
      Alert.alert("Error", "You must agree to the terms and conditions");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstname} ${lastname}`,
      });

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: `${firstname} ${lastname}`,
        uid: user.uid,
      });

      

      console.log("User registered with:", user.email);
      navigation.navigate("CreateFamilyScreen");
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/email-already-in-use":
          Alert.alert(
            "Registration Error",
            "The email address is already in use by another account."
          );
          break;
        case "auth/invalid-email":
          Alert.alert("Registration Error", "The email address is not valid.");
          break;
        case "auth/operation-not-allowed":
          Alert.alert(
            "Registration Error",
            "Email/password accounts are not enabled."
          );
          break;
        case "auth/weak-password":
          Alert.alert(
            "Registration Error",
            "The password is not strong enough."
          );
          break;
        default:
          Alert.alert("Registration Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.bg}>
          <Image
            source={require("../../assets/Bonbon2.png")}
            style={styles.bgimgs1}
          />
          <Image
            source={require("../../assets/Bonbon3.png")}
            style={styles.bgimgs2}
          />
          <Image
            source={require("../../assets/bonbon.png")}
            style={styles.bgimgs3}
          />
          <Image
            source={require("../../assets/Bonbon4.png")}
            style={styles.bgimgs4}
          />
          <Image
            source={require("../../assets/Bonbon5.png")}
            style={styles.bgimgs5}
          />
          <Image
            source={require("../../assets/Bonbon6.png")}
            style={styles.bgimgs6}
          />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>

            <Text
              style={{
                fontSize: 18,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Lets help your family in completing tasks !
            </Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Index")}
            >
              <Text style={styles.logintext}>Already have an account ?</Text>
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
                {" "}
                Login
              </Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Register</Text>

            <Text style={styles.inputDescription}>Firstname</Text>
            <TextInput
              style={styles.input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Firstname"
              value={firstname}
              onChangeText={setFirstname}
            />
            <Text style={styles.inputDescription}>Lastname</Text>

            <TextInput
              style={styles.input}
              placeholder="Lastname"
              value={lastname}
              onChangeText={setLastname}
            />
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
            <Text style={styles.inputDescription}>Confirm password</Text>

            <TextInput
              style={styles.input}
              placeholder="confirm Password"
              secureTextEntry={!isPasswordShown}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View
              style={{
                flexDirection: "row",
                paddingBottom: 16,
              }}
            >
              <Checkbox
                style={{ marginRight: 8 , fontFamily: "Poppins" }}
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#BEACFF" : "grey"}
              />
              <Text>I aggree to the terms and conditions</Text>
            </View>
            <TouchableOpacity style={styles.LogInBtn} onPress={handleRegister}>
              <Text style={styles.LogText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    right: -30,
    top: 300,
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
  header: {
    alignItems: "left",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  content: {
    marginHorizontal: 20,
    marginBottom: 50,
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
    fontFamily: "PoppinsBold",
    marginBottom: 20,
    color: "#000",
    marginVertical: 12,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
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
    marginBottom: 15,
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
  LogInBtn: {
    backgroundColor: "#EDE8FF",
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },
  LogText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
  },

  loginLink: {
    width: "100%",
    marginVertical: 20,
    fontSize: 18,
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "baseline",
  },
  logintext: {
    fontSize: 18,
    fontFamily: "Poppins",
    textAlign: "center",
  },
});

export default Signup;
