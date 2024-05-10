import React, { useState, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";
import Button from "../../components/Button";
import TaskCard from "../../components/TaskCard";

const { width } = Dimensions.get("window");

export default function Home() {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);

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

  const handleTaskPress = (task, isDaily) => {
    if (isDaily) {
      setDailyTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, isDone: !t.isDone } : t
        )
      );
      console.log("Daily Task Pressed");
    } else {
      setWeeklyTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, isDone: !t.isDone } : t
        )
      );
      console.log("Weekly Task Pressed");

    }
  };

  const renderTaskCards = () => {
    // Sample task data
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

    return (
      <View style={styles.taskContainer}>
        <View style={styles.taskSection}>
          <Text style={styles.taskSectionTitle}>Daily Tasks</Text>
          <ScrollView>
            {dailyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleTaskPress(task, true)}
              >
                <TaskCard task={task} isDaily={true} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.taskSection}>
          <Text style={styles.taskSectionTitle}>Weekly Tasks</Text>
          <ScrollView horizontal>
            {weeklyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleTaskPress(task, false)}
              >
                <TaskCard key={task.id} task={task} isDaily={false} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
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
          <View>
            <Text style={styles.title}>Chores</Text>
          </View>
          <Text style={styles.subtitle}>{value.toDateString()}</Text>
          <ScrollView style={styles.placeholder}>
            <View style={styles.placeholderInset}>{renderTaskCards()}</View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          {/* <Button
            title="Create Family"
            onPress={""}
            style={styles.button}
            bgColor="#62D2C3"
          /> */}
        </View>
      </View>
    </SafeAreaView>
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
  taskContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskSection: {
    marginBottom: 16,
    maxHeight: "100%",
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
    marginHorizontal: -4,
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
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  placeholderInset: {
    borderWidth: 2,
    borderColor: "#007260",
    borderStyle: "dashed",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 10,
  },
});
