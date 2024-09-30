import Swiper from "react-native-swiper";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { collection, getDocs, doc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig.js";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Spinner } from "@/components/ui/spinner";

import React from "react";

const CarouselHome = ({ profile, reward, allprofiles }) => {
  const user = auth.currentUser;
  const [rewards, setRewards] = useState([]);
  const [Tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = async () => {
    try {
      const rewardsCollection = collection(
        db,
        `users/${user.uid}/profiles/${profile.id}/rewards`
      );
      const rewardSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRewards(rewardsList);

      // console.log("rewards:", rewards);
    } catch (error) {
      console.error("Error fetching rewards: ", error);
    }
  };

  const fetchTasks = async () => {
    try {
      let tasksData = [];
      if (profile.role === "child") {
        // Fetch tasks specific to the child profile
        const tasksRef = collection(
          db,
          "users",
          user.uid,
          "profiles",
          profile.id,
          "tasks"
        );
        const tasksSnapshot = await getDocs(tasksRef);
        tasksData = tasksSnapshot.docs.map((taskDoc) => ({
          ...taskDoc.data(),
          id: taskDoc.id,
        }));
        const sortedTasks = tasksData.sort((a, b) => b.createdAt - a.createdAt);
        const recentTasks = sortedTasks.slice(0, 4);
        setTasks(recentTasks);
      } else {
        let allTasks = [];

        for (let profile of allprofiles) {
          const tasksRef = collection(
            db,
            "users",
            user.uid,
            "profiles",
            profile.id,
            "tasks"
          );
          const tasksSnapshot = await getDocs(tasksRef);
          const tasks = tasksSnapshot.docs.map((taskDoc) => ({
            ...taskDoc.data(),
            id: taskDoc.id,
          }));

          allTasks = [...allTasks, ...tasks];
        }

        const sortedTasks = allTasks.sort((a, b) => b.createdAt - a.createdAt);
        const recentTasks = sortedTasks.slice(0, 4);
        tasksData = [...tasksData, ...recentTasks];
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchRewards();
      await fetchTasks();
      setLoading(false);
    };
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchRewards();
        await fetchTasks();
      };
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <>
        <View>
          <Spinner size="small" color={"#BEACFF"} />
        </View>
      </>
    );
  }

  return (
    <>
      {reward ? (
        <Swiper
          style={styles.wrapper}
          autoplay={true}
          dot={
            <View
              style={{
                backgroundColor: "#EDE8FF",
                width: 10,
                height: 10,
                borderRadius: 20,
                margin: 3,
                marginBottom: -25,
              }}
            />
          }
          activeDot={
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 20,
                margin: 3,
                backgroundColor: "#BEACFF",
                marginBottom: -25,
              }}
            />
          }
        >
          {rewards.map((reward, index) => (
            <View key={index} style={styles.slide1}>
              <Image
                source={
                  reward.category === "Food"
                    ? require("../../assets/hamburger.png")
                    : reward.category === "Games"
                      ? require("../../assets/game.png")
                      : reward.category === "Event"
                        ? require("../../assets/event.png")
                        : reward.category === "Other"
                          ? require("../../assets/other.png")
                          : { uri: reward.image }
                }
                style={styles.rewardImage}
              />
              <Text style={styles.text}>{reward.title}</Text>
              <View style={styles.price}>
                <Image
                  source={require("../../assets/coin.png")}
                  style={styles.coin}
                />
                <Text style={styles.rewardCost}>{reward.price} coins</Text>
              </View>
            </View>
          ))}
        </Swiper>
      ) : (
        <Swiper
          style={styles.wrapper}
          autoplay={true}
          dot={
            <View
              style={{
                backgroundColor: "#EDE8FF",
                width: 10,
                height: 10,
                borderRadius: 20,
                margin: 3,
                marginBottom: 0,
              }}
            />
          }
          activeDot={
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 20,
                margin: 3,
                backgroundColor: "#BEACFF",
                marginBottom: 0,
              }}
            />
          }
        >
          {Tasks.map((task, index) => (
            <TouchableOpacity
              key={index}
              style={{
                ...styles.taskCard,
                backgroundColor:
                  task.status === "Done"
                    ? "#E0F9E6"
                    : task.status === "To-do"
                      ? "#ffcccb"
                      : task.status === "Pending Review"
                        ? "#FFE3AD"
                        : "#EAF2FB",
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
                  <Text style={styles.taskCategory}>{task.category}</Text>
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
                        source={require("../../assets/sand.png")}
                        style={{
                          resizeMode: "contain",
                          width: 30,
                          height: 30,
                          marginRight: 10,
                        }}
                      />
                      <Text style={styles.taskTime}>{task.time}</Text>
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
                  source={require("../../assets/done.png")}
                  style={styles.doneImage}
                />
              )}
            </TouchableOpacity>
          ))}
        </Swiper>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  slide1: {
    margin: "auto",
    marginVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    width: 160,
    borderRadius: 15,
    backgroundColor: "#EDE8FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },
  slide2: {
    margin: "auto",
    marginVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    width: 160,
    borderRadius: 15,
    backgroundColor: "#EDE8FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },

  text: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  rewardImage: {
    width: 80,
    height: 80,
  },
  price: {
    flexDirection: "row",
  },
  rewardCost: {
    fontSize: 16,
    color: "#5B5B5B",
    textAlign: "center",
    fontFamily: "PoppinsSemiBold",
  },
  coin: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  taskCard: {
    backgroundColor: "#EAF2FB",
    borderRadius: 15,
    marginVertical: 15,
    justifyContent: "center",
    flexDirection: "row",
    width: "auto",
    minHeight: 125,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
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

});

export default CarouselHome;
