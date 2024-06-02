import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: "Jessica",
    totalTasks: 30,
    cleaningTasks: 10,
    studyTasks: 10,
    yearlyTasks: 603,
    image: require("../../assets/jes.png"),
  });

  const [data, setData] = useState([
    {
      category: "cleaning",
      count: userData.cleaningTasks,
      image: require("../../assets/spong.png"),
    },
    {
      category: "study",
      count: userData.studyTasks,
      image: require("../../assets/study.png"),
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.bgCircle}></View>
          <View style={styles.profile}>
            <View style={styles.name}>
              <Text style={styles.familyName}>Glazers</Text>
              <Text style={styles.profileName}>{userData.name}</Text>
            </View>
            <Image source={userData.image} style={styles.profileImage} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tasksContainer}>
            <View style={styles.taskmonth}>
              <Text style={styles.sectionTitle1}>Tasks completed</Text>
              <Text style={styles.tasksCount}>{userData.totalTasks}</Text>
              <Text style={styles.sectionSubtitle}>This month</Text>
            </View>
            <Image
              source={require("../../assets/tasksImage.png")}
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
              {data.map((item, index) => (
                <View key={index} style={styles.taskBox}>
                  <Image source={item.image} style={styles.taskImage1} />
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
                103 more than last year!
              </Text>
              <Text style={styles.tasksCount}>{userData.yearlyTasks}</Text>
              <Text style={styles.sectionSubtitle}>this year</Text>
            </View>
            <View>
              <Image
                style={styles.yearlyImg}
                source={require("../../assets/yearlyTasks.png")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontFamily: "Poppins",
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
    width: 110,
    height: 120,
    borderRadius: 40,
    marginBottom: 10,
  },
  familyName: {
    fontSize: 24,
    color: "white",
    textAlign: "left",
    marginLeft: 5,
    
  },
  profileName: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: "Poppins",
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
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  sectionTitle2: {
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginRight: 10,
    marginBottom: 15,
    fontFamily: "Poppins",
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
    fontFamily: "Poppins",
    fontWeight: "bold",
    textAlign: "left",
  },
  taskCount: {
    fontSize: 50,
    fontFamily: "Poppins",
    fontWeight: "bold",
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
    marginBottom: 50,
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
});

export default ProfileScreen;
