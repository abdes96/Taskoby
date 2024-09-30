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
    //console.log("fetching tasks", selectedProfileTasks);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [selectedProfile])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../assets/loading.png")} />
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
        profile={profile}
        fetchTasks={fetchTasks}
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
                        source={require("../assets/add.png")}
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
                    source={require("../assets/date.png")}
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
                      { backgroundColor: profile.bgColor },
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
                source={require("../assets/option.png")}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.taskContainer}>
            {selectedProfileTasks.length === 0 ||
            selectedProfileTasks.every((task) => task.count === 0) ? (
              <Text style={styles.noTasksText}>No tasks available...</Text>
            ) : (
              (() => {
                const filteredTasks = selectedProfileTasks.filter((task) => {
                  if (!task.dueDate) {
                    console.log("Task missing dueDate:", task.dueDate);
                    return false;
                  }
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
                    return (
                      task.status === "To-do" ||
                      task.status === "Pending Review" ||
                      task.status === "Not Approved"
                    );
                  }
                  if (selectedTab === "Need Approval") {
                    return (
                      task.status === "Pending Review" ||
                      task.status === "Not Approved"
                    );
                  }
                  return true;
                });
                if (filteredTasks.length === 0) {
                  return (
                    <Text style={styles.noTasksText}>
                      No tasks available...
                    </Text>
                  );
                }
                return filteredTasks
                  .sort((a, b) => a.dueDate.toDate() - b.dueDate.toDate())
                  .map((task, index) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const isPastDue = task.dueDate.toDate() < yesterday;
                    return (
                      <View style={styles.taskContent}>
                        <TouchableOpacity
                          key={index}
                          style={{
                            ...styles.taskCard,
                            backgroundColor:
                              task.status === "Done"
                                ? "#E0F9E6"
                                : isPastDue && task.status === "To-do"
                                  ? "#ffcccb"
                                  : task.status === "Pending Review"
                                    ? "#FFE3AD"
                                    : "#EAF2FB",
                          }}
                          onPress={() => {
                            handleTaskClick(task);
                          }}
                        >
                          <View style={styles.left}>
                            <View
                              style={
                                task.status === "Done"
                                  ? styles.lineDone
                                  : task.status === "Pending Review"
                                    ? styles.linePendingReview
                                    : styles.line
                              }
                            ></View>
                            <View style={styles.textTask}>
                              <Text style={styles.taskCategory}>
                                {task.category}
                              </Text>
                              <Text
                                style={styles.taskTitle}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {task.title}
                              </Text>
                              {task.time && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    textAlign: "baseline",
                                  }}
                                >
                                  <Image
                                    source={require("../assets/sand.png")}
                                    style={{
                                      resizeMode: "contain",
                                      width: 30,
                                      height: 30,
                                      marginRight: 10,
                                    }}
                                  />
                                  <Text style={styles.taskTime}>
                                    {task.time}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <Text
                            style={{
                              ...styles.taskStatus,
                              color:
                                task.status === "Done"
                                  ? "#00B72E"
                                  : task.status === "Pending Review"
                                    ? "#D7761C"
                                    : "#0074D1",
                            }}
                          >
                            {task.status}
                          </Text>

                          {task.status === "Done" && (
                            <Image
                              source={require("../assets/done.png")}
                              style={styles.doneImage}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  });
              })()
            )}
          </View>
          <TaskPopup
            visible={isTaskModalVisible}
            onRequestClose={() => setTaskModalVisible(false)}
            task={selectedTask}
            profile={profile}
            selectedProfile={selectedProfile}
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
                  selectedTab === "Need Approval"
                    ? styles.tabSelected
                    : styles.modalButton
                }
                onPress={() => {
                  setSelectedTab("Need Approval");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>Need Approval</Text>
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
    fontFamily: "PoppinsBold",
    textAlign: "left",
    paddingLeft: 20,
  },
  Profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
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
    fontFamily: "PoppinsBold",
    textAlign: "left",
    marginTop: 20,
  },
  btnText: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
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
    fontFamily: "PoppinsBold",
  },

  profileImage: {
    resizeMode: "contain",
    height: 100,
    width: 100,
  },
  circleBackground: {
    height: 130,
    width: 130,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 5,
  },
  profileName: {
    fontSize: 40,
    fontFamily: "PoppinsSemiBold",

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
    fontFamily: "PoppinsBold",
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
    paddingHorizontal: 20,
    backgroundColor: "#EDE8FF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  tabSelected: {
    padding: 5,
    paddingHorizontal: 30,
    backgroundColor: "#BEACFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#030002",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
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
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  tabText: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
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
  noTasksText: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: "#000000",
    textAlign: "center",
    marginVertical: 50,
  },
  taskCard: {
    backgroundColor: "#EAF2FB",
    borderRadius: 15,
    marginVertical: 15,
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    height: 130,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  taskCategory: {
    fontSize: 18,
    color: "#4D4D4D",
    fontFamily: "Poppins",
  },
  textTask: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 15,
    paddingLeft: 0,
    marginRight: 10,
    width: "80%",
  },
  left: {
    flexDirection: "row",
    height: "auto",
  },
  line: {
    width: 10,
    borderRadius: 20,
    margin: 15,
    backgroundColor: "#1978DA",
    height: "60%",
  },
  lineDone: {
    width: 10,
    borderRadius: 20,
    margin: 15,
    backgroundColor: "#00B72E",
    height: "60%",
  },
  linePendingReview: {
    width: 10,
    borderRadius: 20,
    margin: 15,
    backgroundColor: "#D7761C",
    height: "60%",
  },

  taskTitle: {
    fontSize: 28,
    color: "#000000",
    fontFamily: "PoppinsMedium",
    width: "400",
    zIndex: 999,
  },
  taskStatus: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
    textAlign: "right",
    right: 15,
    bottom: 5,
    position: "absolute",
    alignItems: "baseline",
  },
  taskTime: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "PoppinsSemiBold",
  },
  doneImage: {
    position: "absolute",
    resizeMode: "contain",
    zIndex: 999,
    height: 80,
    width: 80,
    right: -20,
    top: -5,
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
    fontFamily: "PoppinsBold",
  },
  modalText: {
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
    fontFamily: "PoppinsBold",
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
    fontFamily: "PoppinsBold",
  },
});

export default Tasks;
