import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../components/Button";
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

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#EEEEEE",
};
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

      const profileRef = doc(db, "users", user.uid , "profiles", "default");

      await setDoc(profileRef, {
            profileId: "default",
            firstname: firstname,
            lastname: lastname,
            role: "parent",
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
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.grey, COLORS.grey]}
    >
      <View>
        <Image
          source={require("../../assets/shape.png")}
          style={styles.image1}
        />
      </View><KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{ marginTop: 80, marginHorizontal: 22 }}>
        <Text style={styles.title}>Create Account</Text>

        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: "Poppins",
            fontWeight: "bold",
          }}
        >
          Lets help your family in completing tasks !
        </Text>
      </View>
      
          <View style={styles.container}>
            <View style={styles.container}>
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
                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.black} />
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
                  style={{ marginRight: 8 }}
                  value={isChecked}
                  onValueChange={setIsChecked}
                  color={isChecked ? COLORS.primary : undefined}
                />

                <Text>I aggree to the terms and conditions</Text>
              </View>
              <Button
                title="Register"
                onPress={handleRegister}
                style={styles.button}
                bgColor="#62D2C3"
              />

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>
                  Already have an account ?
                  <Text style={[styles.loginText, styles.loginLink]}>
                    {" "}
                    Login
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

  loginLink: {
    marginTop: 20,
    color: "#ffff",
    fontSize: 18,
    borderBottomColor: "#fff",
    borderBottomWidth: 2,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  loginText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});

export default Signup;
