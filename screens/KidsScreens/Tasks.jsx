import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";
import TaskCreationModal from "./components/TaskCreationModal";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

import TaskPopup from "./components/TaskPopup";

const win = Dimensions.get("window");
const ratio = win.width / 124;

const Tasks = ({ route }) => {
  const { profile } = route.params;
  const [profiles, setProfiles] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const [selectedTab, setSelectedTab] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedProfileTasks, setSelectedProfileTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddTask = () => {
    setModalVisible(false);
  };

  const handleTaskClick = async (task) => {
    const db = getFirestore();
    const taskRef = doc(
      db,
      "users",
      user.uid,
      "profiles",
      selectedProfile.id,
      "tasks",
      task.id
    );
    const taskSnapshot = await getDoc(taskRef);
    setSelectedTask({ id: task.id, ...taskSnapshot.data() });
    setTaskModalVisible(true);
  };

  useEffect(() => {
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const profilesRef = collection(userRef, "profiles");

    const unsubscribe = onSnapshot(profilesRef, async (profilesSnapshot) => {
      const profilesData = [];
      for (const doc of profilesSnapshot.docs) {
        const profileData = doc.data();
        const tasksRef = collection(doc.ref, "tasks");
        const tasksSnapshot = await getDocs(tasksRef);
        const tasksData = tasksSnapshot.docs.map((taskDoc) => taskDoc.data());
        profileData.tasks = tasksData;
        profileData.numTasks = tasksData.length;
        profilesData.push({ id: doc.id, ...profileData });
      }
      const childProfiles = profilesData.filter(
        (profile) => profile.role === "child"
      );

      setProfiles(childProfiles);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (profile.role === "parent" && profiles.length > 0 && !selectedProfile) {
      setSelectedProfile(profiles[0]);
    } else if (profile.role === "child") {
      setSelectedProfile(profile);
    }
  }, [profiles, profile.role]);

  const fetchTasks = async () => {
    if (selectedProfile) {
      const db = getFirestore();
      const profileRef = doc(
        db,
        "users",
        user.uid,
        "profiles",
        selectedProfile.id
      );
      const tasksRef = collection(profileRef, "tasks");
      const tasksSnapshot = await getDocs(tasksRef);
      const tasksData = tasksSnapshot.docs.map((taskDoc) => ({
        ...taskDoc.data(),
        id: taskDoc.id,
      }));

      setSelectedProfileTasks(tasksData);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [selectedProfile])
  );



  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const dayOfWeek = date.toLocaleString("default", { weekday: "short" });

  return (
    <View style={styles.container}>
      <TaskCreationModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
        selectedProfile={selectedProfile}
        allProfiles={profiles}
      />

      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.tasks}>Tasks</Text>
            {profile.role == "parent" && (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  {profiles.map((member) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={member.id}
                      onPress={() => setSelectedProfile(member)}
                      style={styles.profilesContainer}
                    >
                      <View
                        style={[
                          styles.circleBackgroundProfiles,
                          {
                            backgroundColor:
                              selectedProfile &&
                              selectedProfile.id === member.id
                                ? "#BEACFF"
                                : "#EDE8FF",
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: member.avatarUrl }}
                          style={styles.profileImageProfiles}
                        />
                      </View>
                      <Text style={styles.profileNameProfiles}>
                        {member.firstName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.SelectedProfile}>
                  <View>
                    <Text style={styles.SelectedProfileName}>
                      {selectedProfile
                        ? `${selectedProfile.firstName}'s tasks`
                        : "Loading..."}
                    </Text>
                  </View>
                  {selectedProfile && (
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={styles.addButtonContainer}
                    >
                      <Text style={styles.btnText}>
                        Add a new task for {selectedProfile.firstName}
                      </Text>
                      <Image
                        source={require("../../assets/add.png")}
                        style={styles.addIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {profile.role !== "parent" && (
              <View style={styles.Profile}>
                <View style={styles.dateContainer}>
                  <Image
                    source={require("../../assets/date.png")}
                    style={styles.DatePaper}
                  />
                  <View style={styles.date}>
                    <Text style={styles.dateT}>{dayOfWeek}</Text>
                    <Text style={styles.dateN}>{day}</Text>
                    <Text style={styles.dateT}>{month}</Text>
                  </View>
                </View>
                <View style={styles.profileContainer}>
                  <View
                    style={[
                      styles.circleBackground,
                      { backgroundColor: profile.color },
                    ]}
                  >
                    <Image
                      source={{ uri: profile.avatarUrl }}
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.profileName}>{profile.firstName}</Text>
                </View>
              </View>
            )}
          </View>
          {profile.role !== "parent" && (
            <View style={styles.noticeContainer}>
              <Text style={styles.important}>Important!</Text>
              <Text style={styles.noticeText}>movie night is today!</Text>
            </View>
          )}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={selectedTab === "Today" ? styles.tabSelected : styles.tab}
              onPress={() => setSelectedTab("Today")}
            >
              <Text style={styles.tabText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedTab === "Tomorrow" ? styles.tabSelected : styles.tab
              }
              onPress={() => setSelectedTab("Tomorrow")}
            >
              <Text style={styles.tabText}>Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabOption}
              onPress={() => setMenuVisible(true)}
            >
              <Image
                source={require("../../assets/option.png")}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.taskContainer}>
            {selectedProfileTasks
              .filter((task) => {
                const taskDate = task.dueDate.toDate();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (selectedTab === "Today") {
                  return (
                    taskDate.getDate() === today.getDate() &&
                    taskDate.getMonth() === today.getMonth() &&
                    taskDate.getFullYear() === today.getFullYear()
                  );
                }

                // If the selected tab is "Tomorrow", return tasks due tomorrow
                if (selectedTab === "Tomorrow") {
                  return (
                    taskDate.getDate() === tomorrow.getDate() &&
                    taskDate.getMonth() === tomorrow.getMonth() &&
                    taskDate.getFullYear() === tomorrow.getFullYear()
                  );
                }

                if (selectedTab === "This Month") {
                  return (
                    taskDate.getMonth() === today.getMonth() &&
                    taskDate.getFullYear() === today.getFullYear()
                  );
                }

                if (selectedTab === "Next 7 Days") {
                  const nextWeek = new Date(today);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  return taskDate >= today && taskDate <= nextWeek;
                }

                if (selectedTab === "All") {
                  return task.status === "To-do";
                }

                return true;
              })
              .sort((a, b) => a.dueDate.toDate() - b.dueDate.toDate())
              .map((task, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const isPastDue = task.dueDate.toDate() < yesterday;
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      ...styles.taskCard,
                      backgroundColor:
                        task.status === "Done"
                          ? "#E0F9E6"
                          : isPastDue && task.status === "To-do"
                          ? "#ffcccb"
                          : "#EAF6FF",
                    }}
                    onPress={() => {
                      if (profile.role === "child") {
                        handleTaskClick(task);
                      }
                    }}
                  >
                    <View style={styles.textTask}>
                      <Text style={styles.taskCategory}>{task.category}</Text>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      {task.time && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingBottom: 10,
                          }}
                        >
                          <Image
                            source={require("../../assets/sand.png")}
                            style={{ width: 25, height: 25, marginRight: 10 }}
                          />
                          <Text style={styles.taskTime}>{task.time}</Text>
                        </View>
                      )}
                      <Text
                        style={{
                          ...styles.taskStatus,
                          color: task.status === "Done" ? "#00B72E" : "#0074D1",
                        }}
                      >
                        {task.status}
                      </Text>
                    </View>
                    {task.status === "Done" && (
                      <Image
                        source={require("../../assets/done.png")}
                        style={styles.doneImage}
                      />
                    )}

                    <ImageBackground
                      source={
                        task.category === "Cleaning"
                          ? require("../../assets/clean.png")
                          : task.category === "Sport"
                          ? require("../../assets/sport.png")
                          : task.category === "Study"
                          ? require("../../assets/study.png")
                          : task.image
                      }
                      style={styles.taskImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
          <TaskPopup
            visible={isTaskModalVisible}
            onRequestClose={() => setTaskModalVisible(false)}
            task={selectedTask}
            profile={profile}
            setTaskModalVisible={setTaskModalVisible}
            fetchTasks={fetchTasks}
          />
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isMenuVisible}
          onRequestClose={() => {
            setModalVisible(!isMenuVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={
                  selectedTab === "All"
                    ? styles.tabSelected
                    : styles.modalButton
                }
                onPress={() => {
                  setSelectedTab("All");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  selectedTab === "Next 7 Days"
                    ? styles.tabSelected
                    : styles.modalButton
                }
                onPress={() => {
                  setSelectedTab("Next 7 Days");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>Next 7 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  selectedTab === "This Month"
                    ? styles.tabSelected
                    : styles.modalButton
                }
                onPress={() => {
                  setSelectedTab("This Month");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>This Month</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },

  header: {
    marginTop: 50,
  },
  tasks: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Poppins",
    textAlign: "left",
    padding: 15,
    paddingLeft: 20,
  },
  Profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  addButtonContainer: {
    backgroundColor: "#FFDFAC",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  SelectedProfile: {
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  SelectedProfileName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins",
    textAlign: "left",
    marginTop: 20,
  },
  btnText: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 10,
  },
  addIcon: {
    width: 50,
    height: 50,
  },

  dateContainer: {
    position: "relative",
  },
  date: {
    position: "absolute",
    top: 40,
    left: 0,
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    width: "100%",
  },
  dateT: {
    fontSize: 24,
    color: "#1978DA",
    fontFamily: "Fredericka",
    textAlign: "center",
    paddingBottom: 5,
  },
  DatePaper: {
    width: 150,
    height: 60 * ratio,
  },

  dateN: {
    fontSize: 60,
    color: "#1978DA",
    fontFamily: "Fredericka",
  },
  profilesContainer: {
    alignItems: "center",
    margin: 10,
  },
  circleBackgroundProfiles: {
    width: 120,
    height: 120,
    borderRadius: 25,
    justifyContent: "center",
    backgroundColor: "#EDE8FF",
    alignItems: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  profileImageProfiles: {
    width: 75,
    height: 75,
  },
  profileNameProfiles: {
    marginTop: 5,
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },

  profileImage: {
    height: 110,
    width: 100,
  },
  circleBackground: {
    height: 150,
    width: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 10,
  },
  profileName: {
    fontSize: 50,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#000000",
  },
  noticeContainer: {
    backgroundColor: "#FFE3AD",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  important: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000000",
  },
  noticeText: {
    fontSize: 16,
    color: "#000000",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  tab: {
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: "#EDE8FF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  tabSelected: {
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: "#BEACFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  tabOption: {
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
  },
  tabText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  menuIcon: {
    width: 30,
    height: 20,
  },
  taskContainer: {
    marginHorizontal: 20,
    marginBottom: 100,
  },
  taskCard: {
    backgroundColor: "#EAF6FF",
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    height: "auto",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  taskCategory: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "Poppins",
  },
  textTask: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  taskTitle: {
    fontSize: 24,
    color: "#000000",
    fontFamily: "Poppins",
    fontWeight: "bold",
    width: 200,
    paddingBottom: 15,
  },
  taskStatus: {
    fontSize: 18,
    fontFamily: "Poppins",
  },
  taskTime: {
    fontSize: 16,
    color: "#000000",
  },
  doneImage: {
    position: "absolute",
    zIndex: 999,
    height: 80,
    width: 80,
    right: -10,
    top: -30,
  },
  taskImage: {
    height: 150,
    width: 200,
    right: 10,
    top: 0,
  },
  tabNavigator: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E3E3E3",
  },
  navIcon: {
    padding: 10,
  },
  navIconImage: {
    width: 30,
    height: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    justifyContent: "space-around",
    minHeight: 300,
    width: 350,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "#EDE8FF",
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    margin: 10,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#EDE8FF",
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    right: -20,
    position: "absolute",
    top: -10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});

export default Tasks;
