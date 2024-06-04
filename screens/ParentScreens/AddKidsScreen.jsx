import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { Alert } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Button from "../../components/Button";

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#EEEEEE",
};

const AVATARS = [
  {
    path: require("../../assets/jes.png"),
    color: "#EE6A7D",
    name: "jes.png",
    color2: "#FFE3AD",
  },
  {
    path: require("../../assets/john.png"),
    color: "#37CE5D",
    name: "john.png",
    color2: "#FFC098",
  },
  {
    path: require("../../assets/mom.png"),
    color: "#F9C3BE",
    name: "mom.png",
    color2: "#CA9DDA",
  },
  {
    path: require("../../assets/dad.png"),
    color: "#0096A0",
    name: "dad.png",
    color2: "#B0D9DC",
  },
];

const AddKidsScreen = ({ navigation }) => {
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;
  // console.log(user.email);

  const [kids, setKids] = useState([
    {
      firstName: "",
      lastName: "",
      birthday: "",
      avatar: null,
      bgColor: null,
      bgColor2: null,
    },
  ]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedKidIndex, setSelectedKidIndex] = useState(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [avatarUrls, setAvatarUrls] = useState([]);

  const fetchAvatarUrls = async () => {
    try {
      const urls = await Promise.all(
        AVATARS.map(async (avatar) => {
          const avatarRef = ref(storage, `avatars/${avatar.name}`);
          return getDownloadURL(avatarRef);
        })
      );
      setAvatarUrls(urls);
    } catch (error) {
      console.error("Error fetching avatar URLs:", error);
    }
  };

  useEffect(() => {
    fetchAvatarUrls();
  }, []);

  const handleAddKid = () => {
    const emptyKid = kids.find(
      (kid) => !kid.firstName || !kid.lastName || !kid.birthday || !kid.avatar
    );

    if (emptyKid) {
      alert("Please fill out all fields for the existing kids.");
      return;
    }

    setKids([
      ...kids,
      {
        firstName: "",
        lastName: "",
        birthday: "",
        avatar: null,
        bgColor: null,
        bgColor2: null,
      },
    ]);
    setSelectedKidIndex(kids.length);
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

  const handleAvatarSelect = async (index) => {
    if (selectedKidIndex !== null) {
      const updatedKids = [...kids];
      const selectedAvatar = AVATARS[index];

      try {
        const avatarUrl = selectedAvatar.name;
        updatedKids[selectedKidIndex].avatar = avatarUrl;
        updatedKids[selectedKidIndex].bgColor = selectedAvatar.color;
        updatedKids[selectedKidIndex].bgColor2 = selectedAvatar.color2;
        updatedKids[selectedKidIndex].avatarIndex = index;

        setKids(updatedKids);
      } catch (error) {
        console.error("Error selecting avatar:", error);
      }
      setSelectedAvatarIndex(index);
    }
  };

  const handleCreateFamily = async () => {
    const emptyKid = kids.find(
      (kid) => !kid.firstName || !kid.lastName || !kid.birthday || !kid.avatar
    );

    if (emptyKid) {
      Alert.alert("Error", "Please fill out all fields for the kids.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const kidsRef = collection(userRef, "profiles");
      const batch = writeBatch(db);

      for (const kid of kids) {
        const kidRef = doc(kidsRef);
        batch.set(kidRef, {
          firstName: kid.firstName,
          lastName: kid.lastName,
          birthday: kid.birthday,
          avatarUrl: avatarUrls[selectedAvatarIndex],
          bgColor: kid.bgColor,
          bgColor2: kid.bgColor2,
          role: "child",
        });

        const Tasks = collection(kidRef, "tasks");
        const taskCounterRef = doc(Tasks, "counter");
        batch.set(taskCounterRef, { count: 0 });
      }

      await batch.commit();
      navigation.navigate("ChooseProfileScreen");
    } catch (error) {
      console.error("Error saving kids profiles:", error);
      Alert.alert("Error", "Could not save kid profiles. Please try again.");
    }
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.grey, COLORS.primary]}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Add your kids</Text>

          {kids.map((kid, index) => (
            <View style={styles.inputs} key={index}>
              <Text style={styles.subtitle}>Kid {index + 1}</Text>
              <TextInput
                style={styles.kidInput}
                placeholder={`First Name`}
                value={kid.firstName}
                onChangeText={(text) =>
                  handleKidChange(index, "firstName", text)
                }
              />
              <TextInput
                style={styles.kidInput}
                placeholder={`Last Name`}
                value={kid.lastName}
                onChangeText={(text) =>
                  handleKidChange(index, "lastName", text)
                }
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
              <Text style={styles.avatarText}>Select Avatar</Text>
              <View style={styles.avatarsContainer}>
                {AVATARS.map((avatar, avatarIndex) => (
                  <TouchableOpacity
                    key={avatarIndex}
                    onPress={() => {
                      setSelectedKidIndex(index);
                      handleAvatarSelect(avatarIndex);
                    }}
                  >
                    <Image
                      source={{ uri: avatarUrls[avatarIndex] }}
                      style={[
                        styles.avatar,
                        kid.avatarIndex === avatarIndex
                          ? styles.selectedAvatar
                          : null,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 100,
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
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  avatar: {
    width: 75,
    height: 80,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "#000",
    padding: 30,
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
