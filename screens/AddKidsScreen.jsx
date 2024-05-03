import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Button from "../components/Button";

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#EEEEEE",
};

const AddKidsScreen = ({ navigation }) => {
  const [kids, setKids] = useState([{ firstName: "", birthday: "" }]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedKidIndex, setSelectedKidIndex] = useState(null);

  const handleAddKid = () => {
    const emptyKid = kids.find((kid) => !kid.firstName || !kid.birthday);

    if (emptyKid) {
      alert("Please fill out all fieldsw< for the existing kids.");
      return;
    }

    setKids([...kids, { firstName: "", birthday: "" }]);

  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (selectedKidIndex !== null) {
      const updatedKids = [...kids];
      updatedKids[selectedKidIndex].birthday = currentDate;
      setKids(updatedKids);
    }
    setShowDatePicker(false);
  };

  const handleKidChange = (index, key, value) => {
    const updatedKids = [...kids];
    updatedKids[index][key] = value;
    setKids(updatedKids);
  };

  const handleCreateFamily = () => {
    navigation.navigate("Home");

  };

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.grey, COLORS.primary]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add your kids</Text>

        {kids.map((kid, index) => (
          <View style={styles.inputs} key={index}>
            <Text style={styles.subtitle}>Kid {index + 1}</Text>
            <TextInput
              style={styles.kidInput}
              placeholder={`First Name`}
              value={kid.firstName}
              onChangeText={(text) => handleKidChange(index, "firstName", text)}
            />
            <TouchableOpacity
              style={styles.kidInput}
              onPress={() => {
                setShowDatePicker(true);
                setSelectedKidIndex(index);
              }}
            >
              <Text style={styles.date}>
                {kid.birthday
                  ? kid.birthday.toLocaleDateString()
                  : "Select Birthday"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}
          </View>
        ))}

        <Button
          title="Create Family"
          onPress={handleCreateFamily}
          style={styles.button}
          bgColor="#62D2C3"
        />

        <Button
          title="Add Another Kid"
          onPress={handleAddKid}
          style={styles.button}
          bgColor="#62D2C3"
        >
          <Icon name="add" size={24} color="white" />
        </Button>
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
  date: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ffff",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 15,
    fontFamily: "Poppins",
    fontSize: 16,
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
  kidInput: {
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
});

export default AddKidsScreen;
