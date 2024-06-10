import React, { useState, useEffect } from "react";
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
import { auth, db } from "../../firebaseConfig";
import { writeBatch, doc } from "firebase/firestore";
import { ref, getDownloadURL, getStorage } from "firebase/storage";

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

const CreateFamilyScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const storage = getStorage();
  const [guardians, setGuardians] = useState([
    {
      firstname: "",
      lastname: "",
      specificRole: "",
      avatar: null,
      bgColor: null,
      bgColor2: null,
    },
  ]);
  const [parentAvatarUrls, setParentAvatarUrls] = useState([]);
  const [selectedParentAvatarIndex, setSelectedParentAvatarIndex] = useState(0);

  const fetchParentAvatarUrls = async () => {
    try {
      const urls = await Promise.all(
        AVATARS.map(async (avatar) => {
          const avatarRef = ref(storage, `avatars/${avatar.name}`);
          return getDownloadURL(avatarRef);
        })
      );
      setParentAvatarUrls(urls);
    } catch (error) {
      console.error("Error fetching parent avatar URLs:", error);
    }
  };

  useEffect(() => {
    fetchParentAvatarUrls();
  }, []);

  const handleParentAvatarSelect = async (parentIndex, avatarIndex) => {
    const updatedGuardians = [...guardians];
    const selectedAvatar = AVATARS[avatarIndex];

    try {
      const avatarUrl = selectedAvatar.name;
      updatedGuardians[parentIndex].avatar = avatarUrl;
      updatedGuardians[parentIndex].bgColor = selectedAvatar.color;
      updatedGuardians[parentIndex].bgColor2 = selectedAvatar.color2;
      updatedGuardians[parentIndex].avatarIndex = avatarIndex;

      setGuardians(updatedGuardians);
    } catch (error) {
      console.error("Error selecting parent avatar:", error);
    }
    setSelectedParentAvatarIndex(avatarIndex);

  };

  const handleAddGuardian = () => {
    const emptyGuardian = guardians.find(
      (guardian) =>
        !guardian.firstname ||
        !guardian.lastname ||
        !guardian.specificRole ||
        !guardian.avatar
    );

    if (emptyGuardian) {
      alert("Please fill out all fields for the existing guardians.");
      return;
    }

    setGuardians([
      ...guardians,
      { firstname: "", lastname: "", specificRole: "" , avatar: null, bgColor: null, bgColor2: null},
    ]);
  };

  const handleGuardianChange = (index, key, value) => {
    const updatedGuardians = [...guardians];
    updatedGuardians[index][key] = value;
    setGuardians(updatedGuardians);
  };

  const handleCreateFamily = async () => {
    const emptyGuardian = guardians.find(
      (guardian) => !guardian.firstname || !guardian.lastname
    );

    if (emptyGuardian) {
      alert("Please fill out all fields for the existing guardians.");
      return;
    }
    const batch = writeBatch(db);

    guardians.forEach((guardian, index) => {
      const profileRef = doc(
        db,
        "users",
        user.uid,
        "profiles",
        `guardian${index + 1}`
      );
      batch.set(profileRef, {
        profileId: `guardian${index + 1}`,
        firstName: guardian.firstname,
        lastName: guardian.lastname,
        role: "parent",
        specificRole: guardian.specificRole,
        avatarUrl: parentAvatarUrls[selectedParentAvatarIndex],
        bgColor: guardian.bgColor,
        bgColor2: guardian.bgColor2,
      });
    });

    await batch.commit();
    console.log("Family created successfully!", guardians);
    navigation.navigate("AddKidsScreen");
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
            <Text style={styles.title}>Create Family</Text>

            <Text
              style={{
                fontSize: 18,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Let's help your family in completing tasks !
            </Text>
          </View>
          <View style={styles.content}>
            {guardians.map((guardian, index) => (
              <View style={styles.inputs} key={index}>
                <Text style={styles.subtitle}>Parent {index + 1}</Text>
                <TextInput
                  style={styles.guardianInput}
                  placeholder={`Firstname`}
                  value={guardian.firstname}
                  onChangeText={(text) =>
                    handleGuardianChange(index, "firstname", text)
                  }
                />
                <TextInput
                  style={styles.guardianInput}
                  placeholder={`Lastname`}
                  value={guardian.lastname}
                  onChangeText={(text) =>
                    handleGuardianChange(index, "lastname", text)
                  }
                />
                <TextInput
                  style={styles.guardianInput}
                  placeholder={`Role (e.g., Mom, Dad)`}
                  value={guardian.specificRole}
                  onChangeText={(text) =>
                    handleGuardianChange(index, "specificRole", text)
                  }
                />
                <Text style={styles.avatarText}>Select Avatar</Text>
                <View style={styles.avatarsContainer}>
                  {AVATARS.map((avatar, avatarIndex) => (
                    <TouchableOpacity
                      key={avatarIndex}
                      onPress={() =>
                        handleParentAvatarSelect(index, avatarIndex)
                      }
                    >
                      <Image
                        source={{ uri: parentAvatarUrls[avatarIndex] }}
                        style={[
                          styles.avatar,
                          guardian.avatarIndex === avatarIndex
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
              onPress={handleAddGuardian}
            >
              <Text style={styles.LogText}>Add another parent ?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.AddBtn}
              onPress={handleCreateFamily}
            >
              <Text style={styles.LogText}>Create profile parent</Text>
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
    top: 200,
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
  header: {
    alignItems: "left",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  inputs: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "PoppinsBold",
    marginBottom: 20,
    marginVertical: 12,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 10,
    color: "#000",
    marginVertical: 12,
  },

  button: {
    marginBottom: 15,
  },
  guardianInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#E9F5FF",
    marginBottom: 15,
    fontSize: 16,
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
    width: 80,
    height: 80,
    borderRadius: 50,
    padding: 45,
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

export default CreateFamilyScreen;
