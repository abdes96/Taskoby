import React, { useState } from "react";
import {
  Modal,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

const images = {
  dropdownIcon: require("../../assets/dropdown.png"),
  sand: require("../../assets/sand.png"),
  camera: require("../../assets/camera.png"),
};

const RewardCreationModal = ({ isVisible, onClose, profile, fetchRewards }) => {
  const [allProfiles, setProfiles] = useState([]);
  const [newReward, setNewReward] = useState({
    title: "",
    category: null,
    specificRole: null,
    price: 0,
  });
  const user = getAuth().currentUser;

  useFocusEffect(
    React.useCallback(() => {
      const userRef = doc(db, "users", user.uid);
      const profilesRef = collection(userRef, "profiles");
      const unsubscribe = onSnapshot(profilesRef, (profilesSnapshot) => {
        const profilesData = profilesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProfiles(profilesData);
      });
      return () => unsubscribe();
    }, [user.uid])
  );

  const handleAddReward = async () => {
    if (!newReward.title || !newReward.category || !newReward.price) {
      alert("Please fill in all fields");
      return;
    }
    if (!newReward.category || newReward.category === "Select a category") {
      alert("Category is required!");
      return;
    }
    try {
      const rewardData = {
        title: newReward.title,
        category: newReward.category,
        price: newReward.price,
      };

      const firstProfile = allProfiles[0];
      const rewardsRefFirstProfile = collection(
        db,
        `users/${user.uid}/profiles/${firstProfile.id}/rewards`
      );
      const rewardDocRef = await addDoc(rewardsRefFirstProfile, {
        ...rewardData,
        specificRole: profile.specificRole,
      });
      const rewardId = rewardDocRef.id;

      for (let i = 1; i < allProfiles.length; i++) {
        const member = allProfiles[i];
        const rewardsRef = doc(
          db,
          `users/${user.uid}/profiles/${member.id}/rewards/${rewardId}`
        );
        await setDoc(rewardsRef, {
          ...rewardData,
          specificRole: profile.specificRole,
        });
      }

      setNewReward({
        title: "",
        category: null,
        specificRole: null,
        price: 0,
      });
      const tokensRef = collection(db, `users/${user.uid}/tokens`);
      const tokensSnapshot = await getDocs(tokensRef);
      const tokens = tokensSnapshot.docs.map((doc) => doc.data().expoPushToken);

      for (let token of tokens) {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "accept-encoding": "gzip, deflate",
            host: "exp.host",
          },
          body: JSON.stringify({
            to: token,
            title: "New award!",
            body: `🎉 ${rewardData.title} has been added as a new award !.`,
            data: { extraData: "Some extra data" },
          }),
        });
      }

      alert("Reward added successfully");
      onClose(); // Close the modal
      fetchRewards();
    } catch (error) {
      console.error("Error adding reward: ", error);
    }
  };

  const CustomDropdown = ({ value, setValue, options, placeholder }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{value || placeholder}</Text>
            <Image
              source={images.dropdownIcon}
              resizeMode="containe"
              style={styles.dropdownIcon}
            />
          </View>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setValue(item.label);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownMenuItem}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ScrollView>
          <View style={styles.modalView}>
            <View style={styles.topmodal}>
              <TouchableOpacity>
                <Text style={styles.buttonText}>Add Reward</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.Cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.Content}>
              <View style={styles.modalInput}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.modalText}
                  placeholder="ex. make home work"
                  value={newReward.title}
                  onChangeText={(text) =>
                    setNewReward({ ...newReward, title: text })
                  }
                />
              </View>

              <View style={styles.modalInput}>
                <Text style={styles.label}>Category</Text>
                <CustomDropdown
                  placeholder="Select a category"
                  value={newReward.category}
                  setValue={(value) => {
                    if (value !== "") {
                      setNewReward({ ...newReward, category: value });
                    }
                  }}
                  options={[
                    { label: "Select a category", value: "" },
                    { label: "Games", value: "game" },
                    { label: "Food", value: "food" },
                    { label: "Event", value: "event" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </View>
              <View style={styles.modalInput}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.modalText}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={newReward.price}
                  onChangeText={(text) =>
                    setNewReward({ ...newReward, price: Number(text) })
                  }
                />
              </View>

              <View style={styles.ModalButton2}>
                <TouchableOpacity
                  onPress={handleAddReward}
                  style={styles.ModalButton}
                >
                  <Text style={styles.ButtonText}>Add Reward</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = {
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "100%",
    padding: 20,
    alignItems: "center",
    marginTop: 22,
  },
  modalText: {
    width: "100%",
    backgroundColor: "#E9F5FF",
    fontFamily: "Poppins",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 20,
    height: 60,
    borderRadius: 15,
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#E9F5FF",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 20,
    height: 60,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  dropdownIcon: {
    height: 14,
    width: 24.5,
    right: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownMenu: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    maxHeight: "50%",
    backgroundColor: "#E9F5FF",
  },
  dropdownMenuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E9F5FF",
    fontFamily: "Poppins",
    fontSize: 16,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "PoppinsBold",

    margin: 10,
  },
  Cancel: {
    fontSize: 20,
    fontFamily: "Poppins",
    margin: 10,
    color: "red",
  },
  topmodal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  Content: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  modalInput: {
    width: "100%",
    marginBottom: 20,
  },

  label: {
    fontSize: 18,
    fontFamily: "PoppinsBold",

    marginBottom: 10,
  },

  ButtonText: {
    fontSize: 18,
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontFamily: "PoppinsBold",
  },
  ModalButton: {
    borderRadius: 15,
    backgroundColor: "#EDE8FF",
    borderWidth: 1,
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
    marginBottom: 50,
  },
  ModalButton2: {
    width: "100%",
    alignItems: "flex-end",
  },
};

export default RewardCreationModal;
