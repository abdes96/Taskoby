import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleRegister = () => {};

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.grey, COLORS.primary]}
    >
      <View style={{ marginTop: 80, marginHorizontal: 22 }}>
        <Text style={styles.title}>Create Account</Text>

        <Text
          style={{
            fontSize: 16,
            color: COLORS.black,
            fontFamily: "Poppins",
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
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Register"
            onPress={handleRegister}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>
              Already have an account ?
              <Text style={[styles.loginText, styles.loginLink]}> Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 20,
    color: "#000",
    marginVertical: 12,
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
    borderRadius: 20,
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
