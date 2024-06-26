import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  Modal,
} from "react-native";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { getStatusBarHeight } from "react-native-status-bar-height";

const ProfileScreen = ({ route, navigation }) => {
  const { profile } = route.params;
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskSummary, setTaskSummary] = useState({
    totalTasks: 0,
    yearlyTasks: 0,
    tasksByCategory: [],
    lastYearTasks: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        const db = getFirestore();
        const tasksRef = collection(
          db,
          `users/${user.uid}/profiles/${profile.id}/tasks`
        );
        const tasksSnapshot = await getDocs(tasksRef);

        const allTasks = [];
        tasksSnapshot.forEach((doc) => {
          allTasks.push({ id: doc.id, ...doc.data() });
        });

        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [profile]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const filtered = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate.toDate().getFullYear() === currentYear &&
        task.status === "Done"
    );

    const totalTasks = filtered.length;

    const lastYearTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate.toDate().getFullYear() === currentYear - 1 &&
        task.status === "Done"
    ).length;

    const thisMonthTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate.toDate().getMonth() === currentMonth &&
        task.dueDate.toDate().getFullYear() === currentYear &&
        task.status === "Done"
    ).length;

    const categories = [...new Set(tasks.map((task) => task.category))];

    const tasksByCategory = categories.map((category) => {
      const tasksInCategory = filtered.filter(
        (task) =>
          task.category === category &&
          task.dueDate.toDate().getMonth() === currentMonth &&
          task.dueDate.toDate().getFullYear() === currentYear &&
          task.status === "Done"
      ).length;

      return { category, count: tasksInCategory };
    });

    setFilteredTasks(filtered);
    setTaskSummary({
      yearlyTasks: totalTasks,
      lastYearTasks: lastYearTasks,
      totalTasks: thisMonthTasks,
      tasksByCategory: tasksByCategory,
    });
  }, [tasks]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View
            style={[styles.bgCircle, { backgroundColor: profile.bgColor2 }]}
          ></View>
          <View style={styles.profile}>
            <View style={styles.name}>
              <Text style={styles.familyName}>{profile.lastName}</Text>
              <Text style={styles.profileName}>{profile.firstName}</Text>
            </View>
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.profileImage}
            />
          </View>
        </View>
        {profile.role === "child" && (
          <>
            <View style={styles.section}>
              <View style={styles.tasksContainer}>
                <View style={styles.taskmonth}>
                  <Text style={styles.sectionTitle1}>Tasks completed</Text>
                  <Text style={styles.tasksCount}>
                    {taskSummary.totalTasks}
                  </Text>
                  <Text style={styles.sectionSubtitle}>This month</Text>
                </View>
                <Image
                  source={require("../assets/tasksImage.png")}
                  style={styles.tasksImage}
                />
              </View>
            </View>
            <View style={styles.section1}>
              <Text style={styles.sectionTitle2}>Tasks</Text>
              <View style={styles.tasksBreakdown}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.headerContainer,
                    { marginLeft: 0 },
                  ]}
                >
                  {taskSummary.tasksByCategory.map((item, index) => (
                    <View key={index} style={styles.taskBox}>
                      <Image
                        source={
                          item.category === "Sport"
                            ? require("../assets/sport.png")
                            : item.category === "Study"
                            ? require("../assets/study.png")
                            : item.category === "Cleaning"
                            ? require("../assets/spong.png")
                            : null
                        }
                        style={styles.taskImage1}
                      />
                      <Text style={styles.category}>{item.category}</Text>
                      <View style={styles.counter}>
                        <Text style={styles.taskCount}>{item.count}</Text>
                        <Text style={styles.taskLabel}> completed</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>This year</Text>
              <View style={styles.yearlyTasksContainer}>
                <View style={styles.yearlyTasksContent}>
                  <Text style={styles.sectionTitle1}>Tasks completed</Text>

                  <Text style={styles.yearlyTasksSubtitle}>
                    {taskSummary.yearlyTasks > taskSummary.lastYearTasks
                      ? `${
                          taskSummary.yearlyTasks - taskSummary.lastYearTasks
                        } more than last year!`
                      : taskSummary.yearlyTasks < taskSummary.lastYearTasks
                      ? `${
                          taskSummary.lastYearTasks - taskSummary.yearlyTasks
                        } less than last year!`
                      : `Same as last year!`}
                  </Text>
                  <Text style={styles.tasksCount}>
                    {taskSummary.yearlyTasks}
                  </Text>
                  <Text style={styles.sectionSubtitle}>this year</Text>
                </View>
                <View>
                  <Image
                    style={styles.yearlyImg}
                    source={require("../assets/yearlyTasks.png")}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {profile.role === "child" && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => {
                auth
                  .signOut()
                  .then(() => {
                    console.log("User signed out!");
                  })
                  .catch((error) => {
                    console.error("Error signing out: ", error);
                  });
              }}
              style={styles.logoutBtn}
            >
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {profile.role === "parent" && (
          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => navigation.navigate("EditAccount")}
            >
              <Text style={styles.settingOptionText}>Edit account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => navigation.navigate("AddKidsScreen")}
            >
              <Text style={styles.settingOptionText}>Add a kid profile</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.settingOption}
              onPress={() => navigation.navigate("CreateFamilyScreen")}
            >
              <Text style={styles.settingOptionText}>Add a parent profile</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingOptionText}>Contact us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => {
                auth
                  .signOut()
                  .then(() => {
                    console.log("User signed out!");
                  })
                  .catch((error) => {
                    console.error("Error signing out: ", error);
                  });
              }}
            >
              <Text style={styles.settingOptionText}>Sign Out</Text>
            </TouchableOpacity>
              <Text style={styles.footerText}>
                © 2024 Abdeslam. All rights reserved.
              </Text>
              <Text> icons by Icon8</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const statusBarHeight = Platform.OS === "ios" ? -getStatusBarHeight() : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    fontFamily: "Poppins",
    height: "100%",
    marginTop: statusBarHeight,
  },
  bgCircle: {
    position: "absolute",
    height: Dimensions.get("window").width + 150,
    width: Dimensions.get("window").width + 150,
    backgroundColor: "#EE6A7D",
    borderRadius: 999,
    zIndex: -999,
    top: -300,
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  profile: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    padding: 20,
    paddingTop: 60,
  },
  name: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  profileImage: {
    resizeMode: "contain",
    width: 120,
    height: 120,
    borderRadius: 40,
    marginBottom: 10,
  },
  familyName: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "white",
    textAlign: "left",
  },
  profileName: {
    fontSize: 48,
    fontFamily: "PoppinsBold",
    color: "white",
    textAlign: "left",
  },
  section: {
    marginBottom: 20,
    padding: 20,
  },
  section1: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontFamily: "PoppinsBold",
  },
  sectionTitle2: {
    fontSize: 18,
    fontFamily: "PoppinsBold",

    paddingLeft: 20,
    marginVertical: 10,
  },
  sectionTitle1: {
    fontSize: 24,
    paddingTop: 15,
    fontFamily: "Poppins",
  },
  tasksContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1D6E3",
    padding: 15,
    paddingVertical: 0,
    borderRadius: 10,
    zIndex: 999,
    borderWidth: 1,
    height: 175,
  },
  taskmonth: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tasksCount: {
    fontSize: 40,
    fontFamily: "PoppinsBold",
    marginRight: 10,
  },
  tasksImage: {
    position: "absolute",
    width: 150,
    height: 150,
    right: 1,
    bottom: 0,
    zIndex: -999,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 15,
    fontFamily: "Poppins",
    color: "#535353",
  },
  tasksBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    paddingRight: 50,
  },
  taskBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    height: 250,
    width: 200,
    borderWidth: 1,
  },
  taskImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  taskImage1: {
    width: 175,
    height: 100,
    marginBottom: 10,
  },

  category: {
    fontSize: 18,
    width: "100%",
    fontFamily: "PoppinsBold",

    textAlign: "left",
  },
  taskCount: {
    fontSize: 50,
    fontFamily: "PoppinsBold",

    textAlign: "left",
  },
  counter: {
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "flex-end",
    width: "100%",
    height: 60,
    textAlign: "left",
  },
  taskLabel: {
    fontSize: 16,
    color: "#717171",
    textAlign: "left",
  },
  yearlyTasksContainer: {
    backgroundColor: "#CCBDAB",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 185,
    borderWidth: 1,
  },
  yearlyTasksContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  yearlyImg: {
    width: 150,
    height: 150,
    right: 20,
    bottom: -20,
  },
  yearlyTasksSubtitle: {
    fontSize: 16,
    color: "#888888",
    marginTop: 5,
  },
  logoutBtn: {
    backgroundColor: "#BEACFF",
    padding: 10,
    fontFamily: "PoppinsBold",
    borderWidth: 1,
    paddingHorizonta: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 20,
    width: "100%",
  },
  settings: {
    backgroundColor: "#BEACFF",
    padding: 10,
    fontFamily: "PoppinsBold",
    borderWidth: 1,
    paddingHorizonta: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 20,
    width: "75%",
    marginTop: 20,
  },
  SettingtitleText: {
    marginTop: 20,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
  logoutText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
  buttons: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    padding: 20,
  },
  settingsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginVertical: 100,
  },
  settingOption: {
    backgroundColor: "#EDE8FF",
    padding: 10,
    borderWidth: 1,
    paddingHorizonta: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 20,
    width: "100%",
    marginBottom: 20,
  },
  settingOptionText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "PoppinsBold",
  },
});

export default ProfileScreen;
