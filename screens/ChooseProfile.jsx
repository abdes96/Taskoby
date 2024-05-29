import { StackRouter } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const UserProfile = ({ name, imageSource, navigation, color }) => (
  <TouchableOpacity
    style={styles.profileContainer}
    onPress={() => {
      navigation.navigate("KidsTabNavigator");
    }}
  >
    <View style={[styles.circleBackground, { backgroundColor: color }]}>
      <Image source={imageSource} style={styles.profileImage} />
    </View>
    <Text style={styles.profileName}>{name}</Text>
  </TouchableOpacity>
);

const ChooseProfile = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bg}>
        <Image
          source={require("../assets/Bonbon2.png")}
          style={styles.bgimgs1}
        />

        <Image
          source={require("../assets/Bonbon3.png")}
          style={styles.bgimgs2}
        />
        <Image
          source={require("../assets/bonbon.png")}
          style={styles.bgimgs3}
        />
        <Image
          source={require("../assets/Bonbon4.png")}
          style={styles.bgimgs4}
        />
        <Image
          source={require("../assets/Bonbon5.png")}
          style={styles.bgimgs5}
        />
        <Image
          source={require("../assets/Bonbon6.png")}
          style={styles.bgimgs6}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Who's in</Text>
          <Image
            source={require("../assets/What.png")}
            style={styles.questionMark}
          />
        </View>
        <View style={styles.profilesContainer}>
          <View style={styles.topLeftEdge} />
          <View style={styles.topRightEdge} />
          <View style={styles.bottomLeftEdge} />
          <View style={styles.bottomRightEdge} />
          <UserProfile
            navigation={navigation}
            name="Jessica"
            imageSource={require("../assets/jes.png")}
            color="#EE6A7D"
          />

          <UserProfile
            navigation={navigation}
            name="Jhon"
            imageSource={require("../assets/john.png")}
            color="#37CE5D"
          />
          <UserProfile
            navigation={navigation}
            name="Dad"
            imageSource={require("../assets/dad.png")}
            color="#0096A0"
          />
          <UserProfile
            navigation={navigation}
            name="Mom"
            imageSource={require("../assets/mom.png")}
            color={"#F9C3BE"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    display: "flex",
    justifyContent: "start",
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  bgimgs1: {
    width: 120,
    height: 130,
    position: "absolute",
    top: 50,
    right: -60,
  },

  bgimgs2: {
    width: 120,
    height: 130,
    position: "absolute",
    padding: 20,
    left: -30,
    top: 50,
  },
  bgimgs3: {
    width: 130,
    height: 150,
    position: "absolute",
    top: -40,
    left: 150,
  },
  bgimgs4: {
    width: 130,
    height: 150,
    position: "absolute",
    bottom: -50,
    right: -50,
  },
  bgimgs5: {
    width: 100,
    height: 130,
    position: "absolute",
    bottom: 0,
    right: 130,
  },
  bgimgs6: {
    width: 120,
    height: 160,
    position: "absolute",
    bottom: -100,
    left: -70,
  },

  content: {
    position: "relative",
    zIndex: 1,
    marginTop: 140,
  },
  bgProfiles: {
    width: "100%",
    top: 220,
    transform: [{ translateX: 20 }],
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    fontSize: 60,
    fontWeight: "900",
    color: "#000000",
    textAlign: "center",
    marginVertical: 20,
  },
  questionMark: {
    height: 100,
    width: 70,
  },
  profilesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  topLeftEdge: {
    position: "absolute",
    left: 0,
    height: 80,
    width: 70,
    borderColor: "#ffd700",
    borderLeftWidth: 15,
    borderTopWidth: 15,
  },
  topRightEdge: {
    position: "absolute",
    right: 0,
    height: 80,
    width: 70,
    borderColor: "#ffd700",
    borderRightWidth: 15,
    borderTopWidth: 15,
  },
  bottomLeftEdge: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 80,
    width: 70,
    borderColor: "#ffd700",
    borderLeftWidth: 15,
    borderBottomWidth: 15,
  },
  bottomRightEdge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: 80,
    width: 70,
    borderColor: "#ffd700",
    borderRightWidth: 15,
    borderBottomWidth: 15,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
  },
  circleBackground: {
    borderRadius: 100,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChooseProfile;
