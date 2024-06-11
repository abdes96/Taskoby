import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Checkbox from "expo-checkbox";
const EditAccount = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email);
          setFirstname(userData.displayName.split(" ")[0]);
          setLastname(userData.displayName.split(" ")[1]);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    const nameRegex = /^[a-zA-Z-' ]+$/;

    if (!firstname || !lastname || !email) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
      Alert.alert(
        "Error",
        "First name and last name should only contain letters, hyphens, apostrophes, and spaces"
      );
      return;
    }

    if (!isChecked) {
      Alert.alert("Error", "You must agree to the terms and conditions");
      return;
    }

    try {
      const user = auth.currentUser;
      await updateProfile(user, {
        displayName: `${firstname} ${lastname}`,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        email: email,
        displayName: `${firstname} ${lastname}`,
      });

      console.log("User updated:", user.email);
      Alert.alert("Success", "Account details updated successfully");
      navigation.navigate("ChooseProfileScreen"); 
    } catch (error) {
      console.error(error);
      Alert.alert("Update Error", error.message);
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
            <Text style={styles.title}>Update Account</Text>

            <Text
              style={{
                fontSize: 18,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Update your account details below
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Edit Account</Text>

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

            <View
              style={{
                flexDirection: "row",
                paddingBottom: 16,
              }}
            >
              <Checkbox
                style={{ marginRight: 8, fontFamily: "Poppins" }}
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#BEACFF" : "grey"}
              />
              <Text>I agree to the terms and conditions</Text>
            </View>
            <TouchableOpacity style={styles.LogInBtn} onPress={handleUpdate}>
              <Text style={styles.LogText}>Update</Text>
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

export default EditAccount;
