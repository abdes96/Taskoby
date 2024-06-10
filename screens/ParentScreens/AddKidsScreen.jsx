import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Alert } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../../components/Button";

const AVATARS = [
  {
    color: "#EE6A7D",
    name: "jes.png",
    color2: "#FFE3AD",
  },
  {
    color: "#37CE5D",
    name: "john.png",
    color2: "#FFC098",
  },
  {
    color: "#F9C3BE",
    name: "mom.png",
    color2: "#CA9DDA",
  },
  {
    color: "#0096A0",
    name: "dad.png",
    color2: "#B0D9DC",
  },
];

const AddKidsScreen = ({ navigation }) => {
  const storage = getStorage();
  const user = auth.currentUser;
  // console.log(user.email);

  const [selectedKidIndex, setSelectedKidIndex] = useState(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [avatarUrls, setAvatarUrls] = useState([]);

  const [kids, setKids] = useState([
    {
      firstName: "",
      lastName: "",
      avatar: null,
      bgColor: null,
      bgColor2: null,
    },
  ]);

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
      (kid) => !kid.firstName || !kid.lastName || !kid.avatar
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
        avatar: null,
        bgColor: null,
        bgColor2: null,
      },
    ]);
    setSelectedKidIndex(kids.length);
  };

  const handleKidChange = (index, key, value) => {
    const updatedKids = [...kids];
    updatedKids[index][key] = value;
    setKids(updatedKids);
  };

  const handleAvatarSelect = async (kidIndex, avatarIndex) => {
    const updatedKids = [...kids];
    const selectedAvatar = AVATARS[avatarIndex];

    try {
      const avatarUrl = selectedAvatar.name;
      updatedKids[kidIndex].avatar = avatarUrl;
      updatedKids[kidIndex].bgColor = selectedAvatar.color;
      updatedKids[kidIndex].bgColor2 = selectedAvatar.color2;
      updatedKids[kidIndex].avatarIndex = avatarIndex;

      setKids(updatedKids);
    } catch (error) {
      console.error("Error selecting avatar:", error);
    }
    setSelectedAvatarIndex(avatarIndex);
  };

  const handleCreateFamily = async () => {
    const emptyKid = kids.find(
      (kid) => !kid.firstName || !kid.lastName || !kid.avatar
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Text style={styles.title}>Add your kids</Text>
          </View>
          <View style={[styles.content, kids.length > 1 ? styles.contentWithMargin : null]}>
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
                <Text style={styles.avatarText}>Select Avatar</Text>
                <View style={styles.avatarsContainer}>
                  {AVATARS.map((avatar, avatarIndex) => (
                    <TouchableOpacity
                      key={avatarIndex}
                      onPress={() => handleAvatarSelect(index, avatarIndex)}
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

            <TouchableOpacity
              style={styles.AddAnotherBtn}
              onPress={handleAddKid}
            >
              <Text style={styles.LogText}>Add another kid ?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.AddBtn}
              onPress={handleCreateFamily}
            >
              <Text style={styles.LogText}>Create kid profile</Text>
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
  header: {
    alignItems: "left",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 20,
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
    top: 250,
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

  content: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  contentWithMargin: {
    marginBottom: 100,
  },

  inputs: {
    marginBottom: 50,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "PoppinsSemiBold",
    marginTop: 10,
  },
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  avatar: {
    resizeMode: "contain",
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "#000",
    
    borderRadius: 50,
    padding: 45,
  },

  title: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    marginBottom: 20,
    color: "#000",
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 15,
    color: "#000",
    marginVertical: 12,
  },
  kidInput: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#E9F5FF",
    marginBottom: 15,
    fontSize: 16,
  },

  addButton: {
    backgroundColor: "#007260",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  AddBtn: {
    backgroundColor: "#E0F9E6",
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
  },
  AddAnotherBtn: {
    backgroundColor: "#FFDFAC",
    padding: 15,
    borderRadius: 15,
    marginBottom: 50,
    borderWidth: 1,
  },
  LogText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
  },
});

export default AddKidsScreen;
