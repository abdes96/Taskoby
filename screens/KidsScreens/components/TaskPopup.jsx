import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const TaskPopup = ({ visible, onRequestClose, task, profile ,setTaskModalVisible , fetchTasks  }) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const user = auth.currentUser;

  useEffect(() => {
    setUpdatedTask({ ...task });
  }, [task]);

  const markTaskAsDone = async () => {
    const taskRef = doc(
      db,
      `users/${user.uid}/profiles/${profile.id}/tasks/${task.id}`
    );

    await updateDoc(taskRef, {
      status: "Done",
    });

    const taskSnapshot = await getDoc(taskRef);
    const taskData = taskSnapshot.data();
    setUpdatedTask({ id: task.id, ...taskData });
    fetchTasks();
    setTaskModalVisible(false);

  };


  if (!updatedTask) return null;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}
      presentationStyle="pageSheet"
      isModalInPresentation={true}
    >
      <View style={styles.contentTask}>
        <Text style={styles.headerText}>Today's tasks</Text>
        <View style={styles.divider} />
        <Image source={{ uri: updatedTask.imageUrl }} style={styles.taskImage} />
        <Text style={styles.taskTitle}>{updatedTask.title}</Text>
        {updatedTask.note && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Note</Text>
            <Text style={styles.noteText}>{updatedTask.note}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.pictureProofButton}>
          <Text style={styles.buttonText}>Add picture proof</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={markTaskAsDone}>
          <Text style={styles.buttonText}>Mark as done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default TaskPopup;

const styles = StyleSheet.create({
  contentTask: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9F5FF",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  taskImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noteContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
  },
  pictureProofButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  doneButton: {
    backgroundColor: "#00B72E",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
