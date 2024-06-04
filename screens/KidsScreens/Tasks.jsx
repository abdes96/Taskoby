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
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tasksData = [
  {
    category: "cleaning",
    title: "Clean your room",
    status: "To-do",
    image: require("../../assets/clean.png"),
  },
  {
    category: "Study",
    title: "Do your math homework",
    status: "Done",
    image: require("../../assets/study.png"),
  },
  {
    category: "Sport",
    title: "Football tonight!",
    time: "08:00 pm",
    status: "To-do",
    image: require("../../assets/sport.png"),
  },
];


const win = Dimensions.get("window");
const ratio = win.width / 124;

const Tasks = ({ route }) => {
  const { profile } = route.params;
  const [profiles, setProfiles] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const [selectedTab, setSelectedTab] = useState("Today");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(profile);
  const fetchData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@family_data");
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        return data;
      }
      return null;
    } catch (e) {
      console.log(e);
    }
  };
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("tasksData", jsonValue);
      const storedValue = await AsyncStorage.getItem("tasksData");
      // console.log(storedValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const profilesRef = collection(userRef, "profiles");
      const profilesSnapshot = await getDocs(profilesRef);

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
      storeData(profilesData);
    };

    fetchProfiles();
  }, [user]);

  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
      setLoading(false);
    });
    storeData(tasksData);
  }, []);
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
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.tasks}>Tasks</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20,  }}
            >
              {profile.role == "parent" &&
                profiles.map((member) => (
                  <View key={member.id} style={styles.profilesContainer}>
                    <View
                      style={[
                        styles.circleBackgroundProfiles,
                        { backgroundColor: member.color },
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
                  </View>
                ))}
            </ScrollView>
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
                      { backgroundColor: data[0].color },
                    ]}
                  >
                    <Image
                      source={{ uri: profile.avatarUrl }}
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.profileName}>{data[0].name}</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.noticeContainer}>
            <Text style={styles.important}>Important!</Text>
            <Text style={styles.noticeText}>movie night is today!</Text>
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
            <TouchableOpacity style={styles.tabOption}>
              <Image
                source={require("../../assets/option.png")}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.taskContainer}>
            {tasksData.map((task, index) => (
              <View
                key={index}
                style={{
                  ...styles.taskCard,
                  backgroundColor:
                    task.status === "Done" ? "#E0F9E6" : "#EAF6FF",
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
                  source={task.image}
                  style={styles.taskImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        </ScrollView>
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
    width: 70,
    height: 75,
  },
  profileNameProfiles: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
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
    justifyContent: "space-around",
    marginVertical: 20,
    marginBottom: 50,
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
    fontSize: 16,
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
    fontSize: 16,
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
});

export default Tasks;
