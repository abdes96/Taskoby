import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

const UserProfile = ({ name, imageSource, color, navigation, profile , allprofiles }) => {
  return (
    <TouchableOpacity
      style={styles.profileContainer}
      onPress={() => {
        navigation.navigate("KidsTabNavigator", { profile , allprofiles });
      }}
    >
      <View style={[styles.circleBackground, { backgroundColor: color }]}>
        <Image source={imageSource} style={styles.profileImage} />
      </View>
      <Text style={styles.profileName}>{name}</Text>
    </TouchableOpacity>
  );
};

const ChooseProfile = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);



useFocusEffect(
  React.useCallback(() => {
    const fetchProfiles = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const profilesRef = collection(userRef, "profiles");
      const profilesSnapshot = await getDocs(profilesRef);

      const profilesData = profilesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfiles(profilesData);
      
      if (profilesData.length === 0) {
        navigation.navigate("CreateFamilyScreen");
      } else if (!profilesData.some(profile => profile.role === 'child')) {
        navigation.navigate("AddKidsScreen");
      }
    };
    console.log('fetching profiles' , profiles);

    fetchProfiles();
  }, [])
);

  return (
    <View style={styles.container}>
      <SafeAreaView>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Who's in</Text>
              <Image
                source={require("../assets/What.png")}
                style={styles.questionMark}
              />
            </View>
            <View style={styles.profilesContainer}>
              {profiles.length > 0 && (
                <>
                  <View style={styles.topLeftEdge} />
                  <View style={styles.topRightEdge} />
                  <View style={styles.bottomLeftEdge} />
                  <View style={styles.bottomRightEdge} />
                </>
              )}

              {profiles.map((profile) => {
                return (
                  <UserProfile
                    key={profile.id}
                    navigation={navigation}
                    profile={profile}
                    name={profile.firstName}
                    imageSource={{ uri: profile.avatarUrl }}
                    color={profile.bgColor}
                    allprofiles={profiles}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 1,
    marginVertical: 100,
    padding: 20,
    minHeight: 600,
  },
  bgProfiles: {
    width: "100%",
    top: 220,
    transform: [{ translateX: 20 }],
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 60,
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PoppinsBold",
  },
  questionMark: {
    resizeMode: "contain",
    height: 90,
    width: 90,
    marginLeft: -15,
  },
  profilesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: 10,
    paddingHorizontal: 20,
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
    fontFamily: "PoppinsBold",
  },
});

export default ChooseProfile;
