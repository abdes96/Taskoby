import React, { useState } from "react";
import {
  Modal,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import ToggleButton from "react-native-toggle-element";
import { db } from "../../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DatePicker from "react-native-modern-datepicker";
import * as Notifications from "expo-notifications";

const images = {
  dropdownIcon: require("../../../assets/dropdown.png"),
  sand: require("../../../assets/sand.png"),
  camera: require("../../../assets/camera.png"),
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

const TaskCreationModal = ({
  isVisible,
  onClose,
  onAddTask,
  selectedProfile,
  allProfiles,
  profile,
}) => {
  const [toggleValue, setToggleValue] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    category: null,
    dueDate: "",
    time: null,
    note: null,
    pictureProof: false,
    taskForEveryone: false,
    profile: null,
    specificRole: null,
    status: "To-do",
    reward: 0,
  });

  const handleAddTask = async () => {
    
    if (!newTask.title) {
      alert("Title is required!");
      return;
    }

    if (!newTask.category || newTask.category === "Select a category") {
      alert("Category is required!");
      return;
    }

    if (!newTask.dueDate) {
      alert("Due date is required!");
      return;
    }

    const taskWithProfile = { ...newTask , specificRole: profile.specificRole};

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (newTask.taskForEveryone) {
        for (let profilechild of allProfiles) {
          const specificRole = profile.specificRole;
          const tasksRef = collection(
            db,
            `users/${user.uid}/profiles/${profilechild.id}/tasks`
          );
        await addDoc(tasksRef, { ...taskWithProfile, specificRole: specificRole });
        }

        console.log("Task added successfully to all profiles!");
      } else {
        const tasksRef = collection(
          db,
          `users/${user.uid}/profiles/${selectedProfile.id}/tasks`
        );
        await addDoc(tasksRef, { ...taskWithProfile, specificRole: profile.specificRole });

        console.log("Task added successfully!");
      }

      const tokensRef = collection(db, `users/${user.uid}/tokens`);
      const tokensSnapshot = await getDocs(tokensRef);
      const tokens = tokensSnapshot.docs.map((doc) => doc.data().expoPushToken);

      // Send a notification to each token
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
            title: "New Task Added",
            body: "A new task has been added.",
            data: { extraData: "Some extra data" },
          }),
        });
      }

      onAddTask(taskWithProfile);
      setNewTask({
        title: "",
        category: "",
        dueDate: new Date(),
        time: null,
        note: null,
        pictureProof: false,
        taskForEveryone: false,
        profile: null,
        specificRole: null, 
        status: "Pending Review",
      });
      console.log("Task added successfully!" + taskWithProfile);
      onClose();
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const currentDate = new Date();
  const currentDateString = `${currentDate.getFullYear()}-${(
    "0" +
    (currentDate.getMonth() + 1)
  ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`;

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
              <TouchableOpacity >
                <Text style={styles.buttonText}>Add Task</Text>
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
                  value={newTask.title}
                  onChangeText={(text) =>
                    setNewTask({ ...newTask, title: text })
                  }
                />
              </View>

              <View style={styles.modalInput}>
                <Text style={styles.label}>Category</Text>
                <CustomDropdown
                  placeholder="Select a category"
                  value={newTask.category}
                  setValue={(value) => {
                    if (value !== "") {
                      setNewTask({ ...newTask, category: value });
                    }
                  }}
                  options={[
                    { label: "Select a category", value: "" },
                    { label: "Cleaning", value: "cat1" },
                    { label: "Study", value: "cat2" },
                    { label: "Sport", value: "cat3" },
                    { label: "Cooking", value: "cat4" },
                    { label: "Shopping", value: "cat5" },
                    { label: "Other", value: "cat6" },
                  ]}
                />
              </View>
              <View style={styles.modalInput}>
              <Text style={styles.label}>Reward</Text>
              <TextInput
                style={styles.modalText}
                placeholder="Enter reward"
                keyboardType="numeric"
                value={(newTask.reward)}
                onChangeText={(text) =>
                  setNewTask({ ...newTask, reward: Number(text) })
                }
              />
            </View>
              {isDatePickerVisible && (
                <View style={styles.modalInput}>
                  <DatePicker
                    options={{
                      backgroundColor: "#FFDFAC",
                      textHeaderColor: "#000000",
                      textDefaultColor: "#000000",
                      selectedTextColor: "#ffff",
                      mainColor: "#BEACFF",
                      defaultFont: "PoppinsBold",
                      headerFont: "PoppinsBold",
                      textSecondaryColor: "black",
                      borderColor: "transparent",
                    }}
                    current={currentDateString}
                    selected={currentDateString}
                    mode="calendar"
                    minuteInterval={30}
                    onDateChange={(selectedDate) => {
                      console.log(selectedDate);
                      const formattedDate = selectedDate.replace(/\//g, "-");
                      setNewTask({
                        ...newTask,
                        dueDate: new Date(formattedDate),
                      });
                    }}
                    style={{ borderRadius: 15 }}
                  />
                </View>
              )}

              <View style={styles.modalInput}>
                <Text style={styles.label}>Due date</Text>
                <View style={styles.dateButtons}>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      newTask.dueDate instanceof Date &&
                      isToday(newTask.dueDate)
                        ? { backgroundColor: "#BEACFF", borderWidth: 1 }
                        : { backgroundColor: "#EDE8FF" },
                    ]}
                    onPress={() => {
                      setNewTask({ ...newTask, dueDate: new Date() });
                      setIsDatePickerVisible(false);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      newTask.dueDate instanceof Date &&
                      isTomorrow(newTask.dueDate)
                        ? { backgroundColor: "#BEACFF", borderWidth: 1 }
                        : { backgroundColor: "#EDE8FF" },
                    ]}
                    onPress={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setNewTask({ ...newTask, dueDate: tomorrow });
                      setIsDatePickerVisible(false);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Tomorrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      isDatePickerVisible
                        ? { backgroundColor: "#BEACFF", borderWidth: 1 }
                        : { backgroundColor: "#EDE8FF" },
                    ]}
                    onPress={() => {
                      setNewTask({ ...newTask, dueDate: null });
                      setIsDatePickerVisible(true);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalInput}>
                <View style={styles.Modaltoggle}>
                  <View style={styles.toggletitle}>
                    <Image style={styles.sand} source={images.sand} />
                    <Text style={styles.label2}>Set time</Text>
                    {toggleValue && newTask.time && (
                      <Text style={styles.label3}>{newTask.time}</Text>
                    )}
                  </View>
                  <ToggleButton
                    value={toggleValue}
                    onPress={(newState) => {
                      setToggleValue(newState);
                      if (!newState) {
                        setNewTask({
                          ...newTask,
                          time: null,
                        });
                      }
                    }}
                    thumbActiveComponent={
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "black",
                          borderRadius: 50,
                          width: 26,
                          height: 26,
                          backgroundColor: "white",
                        }}
                      />
                    }
                    thumbInActiveComponent={
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "black",
                          borderRadius: 50,
                          width: 26,
                          height: 26,
                          backgroundColor: "white",
                        }}
                      />
                    }
                    trackBar={{
                      activeBackgroundColor: "#BEACFF",
                      inActiveBackgroundColor: "#ADADAD",
                      borderWidth: 1,
                      borderActiveColor: "#000000",
                      borderInActiveColor: "#000000",
                      width: 52,
                      height: 32,
                      radius: 25,
                      shadowColor: "black",
                      shadowOffset: {
                        width: 6,
                        height: 6,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 25,
                      elevation: 5,
                    }}
                    thumbButton={{
                      activeBackgroundColor: "transparent",
                      inActiveBackgroundColor: "transparent",

                      borderWidth: 1,
                      height: 30,
                      width: 30,
                    }}
                  />
                </View>
              </View>
              {toggleValue && (
                <View style={styles.modalInputTimer}>
                  <DatePicker
                    options={{
                      backgroundColor: "#FFDFAC",
                      textHeaderColor: "red",
                      textDefaultColor: "black",
                      mainColor: "#BEACFF",
                      textFontSize: 20,
                      textHeaderFontSize: 30,
                      selectedTextColor: "white",
                      defaultFont: "PoppinsBold",
                      headerFont: "PoppinsBold",
                    }}
                    style={{
                      padding: 5,
                      borderRadius: 15,
                      backgroundColor: "#FFDFAC",
                    }}
                    mode="time"
                    minuteInterval={5}
                    onTimeChange={(selectedTime) =>
                      setNewTask({
                        ...newTask,
                        time: selectedTime,
                      })
                    }
                  />
                </View>
              )}
              <View style={styles.modalInput}>
                <Text style={styles.label}>Leave note</Text>
                <TextInput
                  style={styles.modalTextNote}
                  placeholder="Add your note here."
                  value={newTask.note}
                  onChangeText={(text) =>
                    setNewTask({ ...newTask, note: text })
                  }
                />
              </View>

              <View style={styles.modalInput}>
                <View style={styles.Modaltoggle}>
                  <View style={styles.toggletitle}>
                    <Image style={styles.camera} source={images.camera} />

                    <Text style={styles.label2}>Picture proof</Text>
                  </View>
                  <ToggleButton
                    value={newTask.pictureProof}
                    onPress={(newState) =>
                      setNewTask({ ...newTask, pictureProof: newState })
                    }
                    thumbActiveComponent={
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "black",
                          borderRadius: 50,
                          width: 26,
                          height: 26,
                          backgroundColor: "white",
                        }}
                      />
                    }
                    thumbInActiveComponent={
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "black",
                          borderRadius: 50,
                          width: 26,
                          height: 26,
                          backgroundColor: "white",
                        }}
                      />
                    }
                    trackBar={{
                      activeBackgroundColor: "#BEACFF",
                      inActiveBackgroundColor: "#ADADAD",
                      borderWidth: 1,
                      borderActiveColor: "#000000",
                      borderInActiveColor: "#000000",
                      width: 52,
                      height: 32,
                      radius: 25,
                      shadowColor: "black",
                      shadowOffset: {
                        width: 6,
                        height: 6,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 25,
                      elevation: 5,
                    }}
                    thumbButton={{
                      activeBackgroundColor: "transparent",
                      inActiveBackgroundColor: "transparent",

                      borderWidth: 1,
                      height: 30,
                      width: 30,
                    }}
                  />
                </View>
              </View>
              <View style={styles.modalInput}>
                <View style={styles.Modaltoggle}>
                  <View style={styles.toggletitle}>
                    <Text style={styles.label2}>Add task for everyone</Text>
                  </View>
                  <ToggleButton
                    value={newTask.taskForEveryone}
                    onPress={(newState) =>
                      setNewTask({ ...newTask, taskForEveryone: newState })
                    }
                    thumbActiveComponent={
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "black",
                          borderRadius: 50,
                          width: 26,
                          height: 26,
                          backgroundColor: "white",
                        }}
                      />
                    }
                    thumbInActiveComponent={
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "black",
                          borderRadius: 50,
                          width: 26,
                          height: 26,
                          backgroundColor: "white",
                        }}
                      />
                    }
                    trackBar={{
                      activeBackgroundColor: "#BEACFF",
                      inActiveBackgroundColor: "#ADADAD",
                      borderWidth: 1,
                      borderActiveColor: "#000000",
                      borderInActiveColor: "#000000",
                      width: 52,
                      height: 32,
                      radius: 25,
                      shadowColor: "black",
                      shadowOffset: {
                        width: 6,
                        height: 6,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 25,
                      elevation: 5,
                    }}
                    thumbButton={{
                      activeBackgroundColor: "transparent",
                      inActiveBackgroundColor: "transparent",

                      borderWidth: 1,
                      height: 30,
                      width: 30,
                    }}
                  />
                </View>
              </View>

              <View style={styles.AddTaskModalButton2}>
                <TouchableOpacity
                  onPress={handleAddTask}
                  style={styles.AddTaskModalButton}
                >
                  <Text style={styles.dateButtonText}>Add Task</Text>
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
  modalInputTimer: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#E9F5FF",
    borderWidth: 1,
    borderRadius: 15,
  },
  modalTextNote: {
    width: "100%",
    backgroundColor: "#E9F5FF",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 15,
    paddingBottom: 100,
  },

  Modaltoggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFDFAC",
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
    height: 60,
    paddingVertical: 5,
  },
  toggletitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  sand: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  camera: {
    width: 31,
    height: 23,
    marginRight: 10,
  },
  label2: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  label3: {
    fontSize: 18,
    fontFamily: "PoppinsBold",

    marginLeft: 50,
  },
  label: {
    fontSize: 18,
    fontFamily: "PoppinsBold",

    marginBottom: 10,
  },
  dateButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateButton: {
    borderRadius: 15,
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  dateButtonText: {
    fontSize: 18,
    color: "black",
    paddingVertical : 10,
    paddingHorizontal: 20,
    fontFamily: "PoppinsBold",
  },
  AddTaskModalButton: {
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
  AddTaskModalButton2: {
    width: "100%",
    alignItems: "flex-end",
  },
};

export default TaskCreationModal;
