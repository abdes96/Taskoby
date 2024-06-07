import React from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [coinBalance, setCoinBalance] = useState(1500);
  const [categories, setCategories] = useState([]);

  const user = auth.currentUser;

  //   const [firstVisit, setFirstVisit] = useState(true);
  //   useEffect(() => {
  //     const checkFirstVisit = async () => {
  //       try {
  //         const value = await AsyncStorage.getItem("@visited_rewards");
  //         if (value !== null) {
  //           setFirstVisit(false);
  //         } else {
  //           await AsyncStorage.setItem("@visited_rewards", "true");
  //         }
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };

  //     checkFirstVisit();
  //   }, []);

  //   if (firstVisit) {
  //     console.log("First Visit");
  //     // navigation.navigate("WelcomeScreen");
  //   }

  useEffect(() => {
    const fetchRewards = async () => {
      const rewardsCollection = collection(db, `users/${user.uid}/rewards`);
      const rewardSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRewards(rewardsList);
      const categories = [
        "All",
        ...new Set(rewardsList.map((reward) => reward.category)),
      ];
      setCategories(categories);
    };

    fetchRewards();
  }, []);

  const renderRewardItem = ({ item }) => (
    <TouchableOpacity style={styles.rewardCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.rewardImage} />
      <Text style={styles.rewardTitle}>{item.title}</Text>
      <Text style={styles.rewardCost}>{item.cost} coins</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>coin balance</Text>
        <View style={styles.Balance}>
          <Image
            source={require("../../assets/coins.png")}
            style={styles.coinIcon}
          />
          <Text style={styles.coinBalance}>{coinBalance}</Text>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category &&
                  styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {rewards.length === 0 ? (
        <Text style={styles.No}>No rewards</Text>
      ) : (
        <FlatList
          data={rewards.filter(
            (reward) =>
              selectedCategory === "All" || reward.category === selectedCategory
          )}
          renderItem={renderRewardItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.rewardsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  No: {
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  balanceContainer: {
    marginVertical: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFDA9E",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 24,
    width: 100,
    fontFamily: "Poppins",
  },
  Balance: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  coinIcon: {
    width: 52,
    height: 47,
  },
  coinBalance: {
    fontSize: 50,
    fontFamily: "PoppinsBold",
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: "#dcd7ff",
  },
  categoryButtonText: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "#5a5a5a",
  },
  selectedCategoryButtonText: {
    color: "#3d3d3d",
  },
  rewardsContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  rewardCard: {
    flex: 1,
    backgroundColor: "#eae6ff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  rewardImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "#5a5a5a",
  },
  rewardCost: {
    fontSize: 14,
    color: "#ff9f1c",
  },
});

export default Rewards;
