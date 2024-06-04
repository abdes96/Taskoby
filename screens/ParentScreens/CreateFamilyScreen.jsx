import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Button from "../../components/Button";

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#EEEEEE",
};

const CreateFamilyScreen = ({ navigation }) => {
  const [guardians, setGuardians] = useState([{ name: "", age: "" }]);

  const handleAddGuardian = () => {
    const emptyGuardian = guardians.find(
      (guardian) => !guardian.name || !guardian.age
    );

    if (emptyGuardian) {
      alert("Please fill out all fields for the existing guardians.");
      return;
    }

    setGuardians([...guardians, { name: "", age: "" }]);
  };

  const handleGuardianChange = (index, key, value) => {
    const updatedGuardians = [...guardians];
    updatedGuardians[index][key] = value;
    setGuardians(updatedGuardians);
  };

  const handleCreateFamily = () => {
    navigation.navigate("AddKidsScreen");
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.grey, COLORS.primary]}
    >
      <View style={styles.container}>
        <Scrollview> 
        <Text style={styles.title}>Create Family</Text>

        {guardians.map((guardian, index) => (
          <View style={styles.inputs} key={index}>
            <Text style={styles.subtitle}>Guardian {index + 1}</Text>
            <TextInput
              style={styles.guardianInput}
              placeholder={` Name`}
              value={guardian.name}
              onChangeText={(text) => handleGuardianChange(index, "name", text)}
            />
            <TextInput
              style={styles.guardianInput}
              placeholder={`Guardian `}
              value={guardian.role}
              onChangeText={(text) => handleGuardianChange(index, "role", text)}
            />
            <TextInput
              style={styles.input}
              placeholder={`Age`}
              keyboardType="numeric"
              value={guardian.age}
              onChangeText={(text) => handleGuardianChange(index, "age", text)}
            />
          </View>
        ))}

        <Button
          title="Create Family"
          onPress={handleCreateFamily}
          style={styles.button}
          bgColor="#62D2C3"
        />

        <Button
          title="Add Another Guardian"
          onPress={handleAddGuardian}
          style={styles.button}
          bgColor="#62D2C3"
        >
          <Icon name="add" size={24} color="white" />
        </Button>
        </Scrollview>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  inputs: {
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
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
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    marginBottom: 15,
  },
  guardianInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ffff",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#007260",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default CreateFamilyScreen;
