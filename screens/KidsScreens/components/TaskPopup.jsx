import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  deleteField,
} from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const TaskPopup = ({
  visible,
  onRequestClose,
  task,
  profile,
  selectedProfile,
  setTaskModalVisible,
  fetchTasks,
}) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const user = auth.currentUser;
  const [image, setImage] = useState();
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [note, setNote] = useState("");

  const takePicture = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `tasks/${task.id}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        setIsUploading(true);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "% done"
            );
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImage(downloadURL);
              setIsUploading(false);
            });
          }
        );
      }
    } catch (error) {
      console.log(error);
      setCameraModalVisible(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setUpdatedTask({ ...task });

      return () => {
      };
    }, [task])
  );
  const addNote = async () => {
    if (!note) {
      alert("Note cannot be empty!");
      return;
    }
    const taskRef = doc(
      db,
      `users/${user.uid}/profiles/${selectedProfile.id}/tasks/${task.id}`
    );

    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();

    const newNote = taskData.note
      ? `${taskData.note}\n\n${
          profile.role === "child" ? profile.firstName : profile.specificRole
        }:\n${note}`
      : `${
          profile.role === "child" ? profile.firstName : profile.specificRole
        }:\n${note}`;

    await updateDoc(taskRef, { note: newNote });

    const updatedTaskSnapshot = await getDoc(taskRef);
    const updatedTaskData = updatedTaskSnapshot.data();

    setUpdatedTask({ id: task.id, ...updatedTaskData });
    setNote("");
  };
  const markTaskAsDone = async () => {
    if (profile.role === "child") {
      if (
        task.pictureProof &&
        !image &&
        profile.role === "child" &&
        task.status !== "Pending Review"
      ) {
        alert("Task requires a picture proof and is not done yet!");
        return;
      }

      const taskRef = doc(
        db,
        `users/${user.uid}/profiles/${profile.id}/tasks/${task.id}`
      );

      const update = {
        status: "Pending Review",
      };

      if (image) {
        update.imageUrl = image;
      }

      await updateDoc(taskRef, update);

      const taskSnapshot = await getDoc(taskRef);
      const taskData = taskSnapshot.data();
      setUpdatedTask({ id: task.id, ...taskData });
      fetchTasks();
      setTaskModalVisible(false);

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
            title: "Task Completed",
            body: `Task: "${taskData.title}" has been done by ${profile.firstName}.`,
            data: { extraData: "Some extra data" },
          }),
        });
      }
      setImage(null);
    }

    // mark task as done for parents
    if (profile.role === "parent") {
      const taskRef = doc(
        db,
        `users/${user.uid}/profiles/${selectedProfile.id}/tasks/${task.id}`
      );

      const taskSnapshot = await getDoc(taskRef);
      const taskData = taskSnapshot.data();
      if (taskData.status === "Done") {
        alert("Task is already marked as done.");
        return;
      }
      const update = {
        status: "Done",
      };
      await updateDoc(taskRef, update);

      setUpdatedTask({ id: task.id, ...taskData, status: "Done" });
      fetchTasks();
      setTaskModalVisible(false);

      // Give coins
      const profileRef = doc(
        db,
        `users/${user.uid}/profiles/${selectedProfile.id}`
      );
      const profileSnapshot = await getDoc(profileRef);
      const profileData = profileSnapshot.data();

      await updateDoc(profileRef, {
        coins: (profileData.coins || 0) + taskData.reward,
      });

      // Send notification
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
            title: "Task Completed",
            body: `${selectedProfile.firstName} has been rewarded with ${
              taskData.reward
            } coins for completing the task: ${taskData.title}! Great job! 🎉`,
            data: { extraData: "Some extra data" },
          }),
        });
      }
    }
  };

  const handleDelete = async () => {
    setImage(null);

    if (!updatedTask.imageUrl && !image) {
      alert("No image to delete!");
      return;
    }

    try {
      const taskRef = doc(
        db,
        `users/${user.uid}/profiles/${selectedProfile.id}/tasks/${task.id}`
      );
      await updateDoc(taskRef, {
        imageUrl: deleteField(),
      });

      const storage = getStorage();
      const imageRef = ref(storage, `tasks/${task.id}`);
      await deleteObject(imageRef);

      const taskSnapshot = await getDoc(taskRef);
      const taskData = taskSnapshot.data();
      setUpdatedTask({ id: task.id, ...taskData });

      alert("Image deleted successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to delete image.");
    }
  };

  const handleNotApproved = async () => {
    const taskRef = doc(
      db,
      `users/${user.uid}/profiles/${selectedProfile.id}/tasks/${task.id}`
    );

    const update = {
      status: "Not Approved",
    };

    await updateDoc(taskRef, update);

    setUpdatedTask({ id: task.id, status: "Not Approved" });
    fetchTasks();
  };
  if (!updatedTask) return null;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      onRequestClose={onRequestClose}
      isModalInPresentation={true}
    >
      <View style={styles.contentTask}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              ...styles.bgCircle,
              backgroundColor:
                updatedTask.status === "Done"
                  ? "#E0F9E6"
                  : styles.bgCircle.backgroundColor,
            }}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.back} onPress={onRequestClose}>
                <Entypo name="chevron-left" size={50} color="#7859E9" />
              </TouchableOpacity>
              <Text style={styles.taskTitle}>{updatedTask.title}</Text>
              <Text style={styles.taskCategory}>{updatedTask.category}</Text>
              <Image
                source={
                  task && task.category === "Cleaning"
                    ? require("../../../assets/clean.png")
                    : task && task.category === "Sport"
                    ? require("../../../assets/sport.png")
                    : task && task.category === "Study"
                    ? require("../../../assets/study.png")
                    : task && task.image
                }
                style={styles.categoryImage}
              />
              <Text
                style={{
                  ...styles.statusText,
                  color:
                    updatedTask.status === "Done"
                      ? "#0EBB39"
                      : styles.statusText.color,
                }}
              >
                {updatedTask.status}
              </Text>
            </View>
          </View>

          <View style={styles.modalTextNote}>
            <Text style={styles.label}>Note</Text>
            <View style={styles.noteContainer}>
              <Text style={styles.textnote}>
                {updatedTask.note
                  ? console.log(updatedTask.note) || updatedTask.note
                  : "There is no note for this task."}
              </Text>
            </View>
          </View>
          <View style={styles.modalLeaveNote}>
            <Text style={styles.label}>Leave note</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textnoteInput}
                placeholder="Leave note here"
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity
                onPress={addNote}
                style={styles.buttonInsideInput}
              >
                <Text style={styles.ButtonText}>Add note</Text>
              </TouchableOpacity>
            </View>
          </View>

          {updatedTask.pictureProof && (
            <>
              {updatedTask.imageUrl || image ? (
                <>
                  <View style={styles.UpdatepictureProofButton}>
                    <Text style={styles.buttonTextPic}>
                      {profile.role === "parent"
                        ? "Picture proof"
                        : (profile.role === "child" &&
                            updatedTask.status === "Done") ||
                          (profile.role === "child" &&
                            updatedTask.status === "Pending Review")
                        ? "Update picture proof"
                        : "Add picture proof"}
                    </Text>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: updatedTask.imageUrl || image }}
                        style={styles.taskImage}
                      />

                      {profile.role === "child" && (
                        <TouchableOpacity
                          onPress={handleDelete}
                          style={styles.deleteIcon}
                        >
                          <MaterialIcons
                            name="delete-forever"
                            size={30}
                            color="red"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </>
              ) : (
                profile.role === "child" && (
                  <TouchableOpacity
                    style={styles.pictureProofButton}
                    onPress={takePicture}
                  >
                    <Text style={styles.buttonTextPic}>
                      {(profile.role === "child" &&
                        updatedTask.status === "Done") ||
                      (profile.role === "child" &&
                        updatedTask.status === "Pending Review")
                        ? "Update picture proof"
                        : "Add picture proof"}
                    </Text>
                  </TouchableOpacity>
                )
              )}
              {isUploading && <Text>Uploading...</Text>}
            </>
          )}
          {!isUploading && profile.role !== "parent" && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={markTaskAsDone}
            >
              <Text style={styles.buttonText}>
                {(profile.role === "child" && updatedTask.status === "Done") ||
                (profile.role === "child" &&
                  updatedTask.status === "Pending Review")
                  ? "Update this task"
                  : "Mark as done"}
              </Text>
            </TouchableOpacity>
          )}
          {profile.role === "parent" && (
            <>
              <TouchableOpacity
                style={styles.redoButton}
                onPress={handleNotApproved}
              >
                <Text style={styles.buttonTextPic}>Ask to redo the task ?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={markTaskAsDone}
              >
                <Text style={styles.buttonText}>Mark as done</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TaskPopup;

const styles = StyleSheet.create({
  contentTask: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },

  bgCircle: {
    position: "absolute",
    minHeight: Dimensions.get("window").width + 200,
    width: Dimensions.get("window").width + 200,
    backgroundColor: "#E9F5FF",
    borderRadius: 999,
    zIndex: -999,
    top: -200,
    alignItems: "center",
  },

  statusText: {
    fontSize: 20,
    fontFamily: "Poppins",
    margin: -20,
    color: "#0074D1",
  },
  header: {
    position: "absolute",
    alignItems: "center",
    zIndex: 2,
    marginTop: "38%",
  },
  back: {
    position: "absolute",
    left: -60,
    top: 5,
  },

  taskImage: {
    width: 300,
    height: 250,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 9,
  },
  taskTitle: {
    fontSize: 40,
    textAlign: "center",
    fontFamily: "PoppinsBold",
    maxWidth: 300,
  },
  taskCategory: {
    fontSize: 24,
    fontFamily: "Poppins",
  },
  categoryImage: {
    resizeMode: "contain",
    width: 250,
    height: 200,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  textnote: {
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "red",
    minHeight: 80,
    borderRadius: 15,
    backgroundColor: "#FFDFAC",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    paddingVertical: 10,
  },
  textnoteInput: {
    fontSize: 16,
    fontFamily: "Poppins",
    alignItems: "start",
    textAlignVertical: "top",
    color: "#4D4D4D",
    padding: 10,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "red",
    minHeight: 150,
    borderRadius: 15,
    backgroundColor: "#E9F5FF",
    borderWidth: 1,
  },

  modalTextNote: {
    marginTop: 400,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  modalLeaveNote: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  buttonInsideInput: {
    position: "absolute",
    right: 10,
    bottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#EDE8FF",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  ButtonText: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  pictureProofButton: {
    backgroundColor: "#FFDFAC",
    padding: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    borderWidth: 1,
    marginBottom: 50,
  },
  redoButton: {
    backgroundColor: "#FFDFAC",
    padding: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    borderWidth: 1,
    marginBottom: 50,
  },
  UpdatepictureProofButton: {
    backgroundColor: "#FFDFAC",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    borderWidth: 1,
    marginBottom: 50,
  },
  doneButton: {
    backgroundColor: "#E0F9E6",
    padding: 10,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
  buttonTextPic: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  AddTaskModalButton: {
    borderRadius: 15,
    backgroundColor: "#EDE8FF",
    borderWidth: 1,
    shadowColor: "#030002",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
    marginBottom: 50,
  },
  imageContainer: {
    marginVertical: 15,
    position: "relative",
    width: 300,
  },
  deleteIcon: {
    position: "absolute",
    right: 10,
    top: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    elevation: 4,
  },
});
