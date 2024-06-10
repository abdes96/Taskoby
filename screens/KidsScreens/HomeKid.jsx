import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const Homekid = ({ route }) => {
  const { profile } = route.params;
  const [profiles, setProfiles] = useState([]);
  const [childs, setChilds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@family_data", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);

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
      childProfiles.sort((a, b) => b.numTasks - a.numTasks);

      setChilds(childProfiles);
      setProfiles(profilesData);
      storeData(profilesData);
      setIsLoading(false);
    };

    fetchProfiles();
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("../../assets/loading.png")} />
      </View>
    );
  }
  const getMostCommonCategory = (tasks) => {
    const categoryCounts = tasks.reduce((counts, task) => {
      counts[task.category] = (counts[task.category] || 0) + 1;
      return counts;
    }, {});

    let mostCommonCategory = null;
    let maxCount = 0;
    let currentMonthCount = 0;
    const currentMonth = new Date().getMonth();
    for (const [category, count] of Object.entries(categoryCounts)) {
      const currentMonthCategoryCount = tasks.filter(
        (task) =>
          task.category === category &&
          task.dueDate.toDate().getMonth() === currentMonth
      ).length;
      if (count > maxCount) {
        mostCommonCategory = category;
        maxCount = count;
        currentMonthCount = currentMonthCategoryCount;
      }
    }

    return { mostCommonCategory, maxCount, currentMonthCount };
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const renderFamilyMember = ({ item, index }) => {
    const { mostCommonCategory, maxCount, currentMonthCount } =
      getMostCommonCategory(item.tasks);
    console.log(
      `Most common category: ${mostCommonCategory}, Count: ${maxCount}, Current month count: ${currentMonthCount}`
    );

    return (
      <View style={styles.member}>
        <View style={styles.rankContainer}>
          <Text
            style={[
              styles.rankText,
              index === 0 ? { color: "#FFD700", fontSize: 60 } : {},
            ]}
          >
            {index + 1}
          </Text>
          <Text style={styles.memberName}>{item.firstName}</Text>
        </View>
        <View
          style={[styles.memberContainer, { backgroundColor: item.bgColor2 }]}
        >
          {index === 0 && (
            <Image
              source={require("../../assets/first.png")}
              style={styles.extraImage}
            />
          )}
          <Image source={{ uri: item.avatarUrl }} style={styles.memberImage} />
          <View style={styles.detailsContainer}>
            <View style={styles.Record}>
              <Text>
                <Text style={styles.recordtext}>{item.numTasks}</Text>
              </Text>
            </View>
            <View>
              <Text style={styles.tasksText}>
                {currentMonthCount && mostCommonCategory
                  ? `At least ${currentMonthCount} ${mostCommonCategory} tasks completed this month.`
                  : "This is a new profile ! No tasks completed yet."}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerTextFamily}>
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 24 }}>
                {profile.lastName}
              </Text>

              <Text style={{ fontFamily: "Poppins", fontSize: 24 }}>
                {" "}
                Family
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.headerContainer,
                { marginLeft: -20, marginRight: -20 },
              ]}
            >
              {profiles.map((member) => (
                <View key={member.id} style={styles.profileContainer}>
                  <View
                    style={[
                      styles.circleBackground,
                      { backgroundColor: member.bgColor },
                    ]}
                  >
                    <Image
                      source={{ uri: member.avatarUrl }}
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.profileName}>{member.firstName}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.classement}>
            <Text style={styles.sectionTitle}>
              Most tasks completed this month!
            </Text>
            {childs.map((profile, index) => (
              <View key={profile.id}>
                {renderFamilyMember({ item: profile, index })}
              </View>
            ))}
            <Button title="Logout" onPress={handleLogout} />
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
  classement: {
    flex: 1,
    backgroundColor: "#F9E6E6",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 100,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
    zIndex: -999,
  },
  headerText: {
    fontSize: 24,
    textAlign: "left",
    paddingBottom: 5,
    fontFamily: "PoppinsBold",
  },

  headerTextFamily: {
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "baseline",
  },
  header: {
    marginTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    paddingHorizontal: 50,
  },
  important: {
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    margin: 10,
  },
  extraImage: {
    height: 90,
    width: 90,
    position: "absolute",
    top: -60,
    right: -30,
    zIndex: 999,
  },
  profileImage: {
    width: 70,
    height: 75,
  },
  circleBackground: {
    width: 85,
    height: 85,
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
    elevation: 5,
  },
  profileName: {
    marginTop: 5,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  sectionTitle: {
    fontSize: 25,
    padding: 10,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 3,
  },
  noticeContainer: {
    backgroundColor: "#FFDA9E",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
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
  noticeText: {
    fontSize: 18,
    textAlign: "center",
  },
  memberContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: -15,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    minWidth: "100%",
    shadowColor: "#030002",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  Record: {
    paddingRight: 10,
  },
  recordtext: {
    fontSize: 48,
    fontFamily: "PoppinsBold",
  },
  member: {
    flexDirection: "column",
    alignItems: "start",
    marginVertical: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 15,
  },
  rankText: {
    paddingLeft: 10,
    fontSize: 45,
    fontFamily: "PoppinsBold",
  },
  memberImage: {
    width: 70,
    height: 75,
  },
  detailsContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    fontSize: 25,
    fontFamily: "PoppinsBold",
    marginLeft: 15,
  },
  tasksText: {
    display: "flex",
    fontSize: 16,
    paddingTop: 5,
    width: 180,
  },
});

export default Homekid;
