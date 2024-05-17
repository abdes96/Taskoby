import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";
import TaskCard from "../../components/TaskCard";
import Button from "../../components/Button";
import TaskModal from "../../components/TaskModal";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#007260",
  secondary: "#0000",
  grey: "#EEEEEE",
};

export default function Home() {
  const swiper = useRef();
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [value, setValue] = useState(new Date());
  const [valueWeekly, setValueWeekly] = useState(
    moment().startOf("week").toDate()
  );

  const [week, setWeek] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const dailyTasks = [
      {
        id: 1,
        title: "Clean your room",
        description: "Make your bed and organize toys.",
        isDone: false,
      },
      {
        id: 2,
        title: "Do your homework",
        description: "Complete your math and reading assignments.",
        isDone: false,
      },
      {
        id: 3,
        title: "Help with dinner",
        description: "Set the table and assist with cooking.",
        isDone: false,
      },
    ];

    const weeklyTasks = [
      {
        id: 1,

        icon: "code",
        label: "TypeScript",
        company: "8 endorsements",
        jobType: "2 experiences",
        years: "GitHub & Figma",
        isDone: false,
      },
      {
        id: 2,
        icon: "git-merge",
        label: "Git",
        company: "3 endorsements",
        jobType: "1 experience",
        years: "GitHub",
        isDone: false,
      },
    ];

    setDailyTasks(dailyTasks);
    setWeeklyTasks(weeklyTasks);
  }, []);

  const weeks = React.useMemo(() => {
    const start = moment().add(week, "weeks").startOf("week");

    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, "week").add(index, "day");

        return {
          weekday: date.format("ddd"),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const [taskToUpdate, setTaskToUpdate] = useState(null);

  const handleTaskPress = (taskId, isDaily) => {
    const tasks = isDaily ? dailyTasks : weeklyTasks;
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      setTaskToUpdate(taskToUpdate);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleMarkAsDone = () => {
    console.log("Mark as done", taskToUpdate);
    setDailyTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskToUpdate.id ? { ...task, isDone: true } : task
      )
    );
    setIsModalVisible(false);
  };

  const renderTaskCards = () => {
    return (
      <View style={styles.taskContainer}>
        <View style={styles.taskSection}>
          <View style={styles.header}>
            <Text style={styles.taskSectionTitle}>Daily Tasks</Text>
            <Text style={styles.subtitle}>{value.toDateString()}</Text>
          </View>
          <View>
            {dailyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleTaskPress(task.id, true)}
              >
                <TaskCard task={task} isDaily={true} isDone={task.isDone} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.taskSection}>
          <Text style={styles.taskSectionTitle}>Weekly Tasks</Text>
          <Text style={styles.subtitle}>
            Week of {startOfWeek} - {endOfWeek}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weeklyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleTaskPress(task.id, false)}
              >
                <TaskCard
                  key={task.id}
                  task={task}
                  isDaily={false}
                  isDone={task.isDone}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const startOfWeek = moment(valueWeekly)
    .startOf("week")
    .format("MMMM Do YYYY");
  const endOfWeek = moment(valueWeekly).endOf("week").format("MMMM Do YYYY");

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text style={styles.title}>Calendar</Text> */}
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={(ind) => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, "week").toDate());
                swiper.current.scrollTo(1, false);
              }, 100);
            }}
          >
            {weeks.map((dates, index) => (
              <View
                style={[styles.itemRow, { paddingHorizontal: 16 }]}
                key={index}
              >
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}
                    >
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: "#62D2C3",
                            borderColor: "#007260 ",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: "#000" },
                          ]}
                        >
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: "#000" },
                          ]}
                        >
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
          <View style={styles.placeholder}>
            <ScrollView
              horizontal
              style={styles.buttonscroll}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity>
                  <Button
                    title="All"
                    onPress={""}
                    style={styles.button}
                    bgColor="#62D2C3"
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Button
                    title="To Do"
                    onPress={""}
                    style={styles.button}
                    bgColor="#62D2C3"
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Button
                    title="Done"
                    onPress={""}
                    style={styles.button}
                    bgColor="#62D2C3"
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
            <View style={styles.placeholderInset}>{renderTaskCards()}</View>
          </View>
        </View>
      </View>
      <BlurView intensity={100} style={styles.absolute} tint="light" />

      <TaskModal
        task={taskToUpdate}
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onDone={handleMarkAsDone}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    marginVertical: 30,
    backgroundColor: "#EEEEEE",
    fontFamily: "Poppins",
  },

  buttonscroll: {
    marginTop: 10,
    position: "absolute",
    right: -16,
    left: -16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#62D2C3",
    backgroundColor: "#62D2C3",
    alignItems: "center",
  },

  taskContainer: {
    paddingHorizontal: 8,
    paddingVertical: 100,
  },
  taskSection: {
    marginBottom: 16,
    maxHeight: "100%",
    justifyContent: "center",
  },
  taskSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
    fontFamily: "Poppins",
  },
  picker: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#999999",
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 100,
    marginHorizontal: 4,
    paddingVertical: 25,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#007260",
    flexDirection: "column",
    alignItems: "center",
  },
  itemRow: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 0,
    padding: 0,
  },
});
