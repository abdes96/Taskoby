import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import {
  getDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const TaskPopup = ({
  visible,
  onRequestClose,
  task,
  profile,
  setTaskModalVisible,
  fetchTasks,
}) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const user = auth.currentUser;
  const [image, setImage] = useState();
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
  const saveImage = async (image) => {
    try {
      setImage(image);
      setCameraModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setUpdatedTask({ ...task });
  }, [task]);

  const markTaskAsDone = async () => {
    const taskRef = doc(
      db,
      `users/${user.uid}/profiles/${profile.id}/tasks/${task.id}`
    );

    const update = {
      status: "Done",
    };

    //add the imageUrl field to the update
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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onRequestClose}
      ></TouchableOpacity>

      <View style={styles.contentTask}>
        <View style={styles.divider} />
        <Image
          source={{ uri: updatedTask.imageUrl }}
          style={styles.taskImage}
        />
        <Text style={styles.taskTitle}>{updatedTask.title}</Text>
        <View style={styles.modalTextNote}>
          <Text style={styles.TextNote}>
            {updatedTask.note
              ? updatedTask.note
              : "There is no note for this task."}
          </Text>
        </View>
        {updatedTask.pictureProof && (
          <>
            <TouchableOpacity
              style={styles.pictureProofButton}
              onPress={takePicture}
            >
              <Text style={styles.buttonText}>Add picture proof</Text>
            </TouchableOpacity>
            {isUploading && <Text>Uploading...</Text>}
          </>
        )}
        {!isUploading && (
          <TouchableOpacity style={styles.doneButton} onPress={markTaskAsDone}>
            <Text style={styles.buttonText}>Mark as done</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default TaskPopup;

const styles = StyleSheet.create({
  contentTask: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9F5FF",
    borderRadius: 20,
    height: "80%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  taskImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 50,
    width: "80%",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 50,
  },
  modalTextNote: {
    width: "100%",
    backgroundColor: "#FFDFAC",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 15,
    paddingBottom: 100,
  },
  TextNote: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },

  pictureProofButton: {
    backgroundColor: "#FFDFAC",
    paddingTop: 20,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doneButton: {
    backgroundColor: "#E0F9E6",
    padding: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
    textAlign: "left",
  },
});
