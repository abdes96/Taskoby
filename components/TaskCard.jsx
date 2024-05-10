import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
const CARD_WIDTH = Math.min(Dimensions.get("screen").width * 0.75, 250);

const TaskCard = ({ task, isDaily, isDone }) => {
  return (
    <View>
      {isDaily && (
        <View style={styles.Daycard}>
          <View style={styles.daily}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
            {isDone && <AntDesign name="checksquare" size={24} color="black" />}
            <View style={styles.listHeader}>
              <Text style={styles.listAction}>View All</Text>
              <View style={styles.icons}>
                <Text style={styles.num}> 0</Text>
                <Ionicons
                  style={styles.Ionicons}
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color="black"
                />
                <Text style={styles.num}> 0</Text>
                <Feather name="upload" size={18} color="black" />
              </View>
            </View>
          </View>
        </View>
      )}

      {!isDaily && (
        <View style={styles.list}>
          <ScrollView
            contentContainerStyle={styles.listContent}
            horizontal={!isDaily}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardIcon}></View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{task.label}</Text>
                  <Text style={styles.cardSubtitle}>{task.company}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>{task.jobType}</Text>
                <Text style={styles.cardFooterText}>{task.years}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },
  daily: {
    marginVertical: 0,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Ionicons: {
    marginRight: 18,
  },
  num: {
    marginRight: 8,
    fontFamily: "Poppins",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listAction: {
    color: "#62d2c3",
  },
  listContent: {
    flexGrow: 1,
  },
  /** Card */
  card: {
    width: CARD_WIDTH,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    shadowColor: "#90a0ca",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },

  Daycard: {
    width: 300,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    shadowColor: "#90a0ca",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff1f5",
  },
  cardBody: {
    paddingLeft: 12,
  },
  list: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    color: "#121a26",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    color: "#778599",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    color: "#778599",
  },
});

export default TaskCard;
