import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';



const familyData = [
  {
    id: "1",
    name: "Jessica",
    image: require("../../assets/jes.png"),
    tasks: 30,
    color: "#EE6A7D",
    color2: "#FFD700",
  },
  {
    id: "2",
    name: "Jhon",
    image: require("../../assets/john.png"),
    tasks: 28,
    color: "#FFC098",
    color2: "#FFC098",
  },
  {
    id: "3",
    name: "Dad",
    image: require("../../assets/dad.png"),
    tasks: 20,
    color: "#B0D9DC",
    color2: "#B0D9DC",
  },
  {
    id: "4",
    name: "Mom",
    image: require("../../assets/mom.png"),
    tasks: 15,
    color: "#F9C3BE",
    color2: "#CA9DDA",
  },
];

const Homekid = () => {

  // To set data
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@family_data', jsonValue)
    const storedValue = await AsyncStorage.getItem('@family_data');
    console.log(storedValue);
  } catch (e) {
    console.log(e);
  }
}


  useEffect(() => {
    storeData(familyData);
  }, []);
  

  const renderFamilyMember = ({ item }) => (
    <View style={styles.member}>
      <View style={styles.rankContainer}>
        <Text
          style={[styles.rankText, item.id === "1" ? { color: "#FFD700" } : {}]}
        >
          {item.id}
        </Text>
        <Text style={styles.memberName}>{item.name}</Text>
      </View>
      <View style={[styles.memberContainer, { backgroundColor: item.color2 }]}>
        {item.id === "1" && (
          <Image
            source={require("../../assets/first.png")}
            style={styles.extraImage}
          />
        )}
        <Image source={item.image} style={styles.memberImage} />
        <View style={styles.detailsContainer}>
          <View style={styles.Record}>
            <Text>
              <Text style={styles.recordtext}>{item.tasks}</Text>
            </Text>
          </View>
          <View>
            <Text style={styles.tasksText}>
              At least 10 homeworks completed this month.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTextFamily}>
              <Text style={{ fontWeight: "bold" }}>Glazzers</Text> Family
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.headerContainer,
                { marginLeft: -20, marginRight: -20 },
              ]}
            >
              {familyData.map((member) => (
                <View key={member.id} style={styles.profileContainer}>
                  <View
                    style={[
                      styles.circleBackground,
                      { backgroundColor: member.color },
                    ]}
                  >
                    <Image source={member.image} style={styles.profileImage} />
                  </View>
                  <Text style={styles.profileName}>{member.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.important}>
            <Text style={styles.headerText}>Important!</Text>
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeText}>Movie night is today!</Text>
            </View>
          </View>
          <View style={styles.classement}>
            <Text style={styles.sectionTitle}>
              Most tasks completed this month!
            </Text>
            {familyData.map((item) => (
              <View key={item.id}>{renderFamilyMember({ item })}</View>
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
    fontWeight: "bold",
  },
  
  headerTextFamily: {
    fontSize: 24,
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
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
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 30,
    padding: 10,
    fontWeight: "bold",
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
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
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
    fontWeight: "bold",
  },
  member: {
    flexDirection: "column",
    alignItems: "start",
    marginVertical: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  rankContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  rankText: {
    fontSize: 60,
    fontWeight: "bold",
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
    fontWeight: "bold",
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
