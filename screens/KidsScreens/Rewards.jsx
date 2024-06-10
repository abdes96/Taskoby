import React from "react";
import { Text, SafeAreaView, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import {
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Rewards = ({ route }) => {
  const { profile } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReward, setSelectedReward] = useState(null);
  const [coinBalance, setCoinBalance] = useState(1500);
  const [categories, setCategories] = useState([]);

  const user = auth.currentUser;

  const [firstVisit, setFirstVisit] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const checkFirstVisit = async () => {
        try {
          await AsyncStorage.setItem("@visited_rewards", "true");
          setFirstVisit(false);
        } catch (e) {
          console.log(e);
        }
      };

      checkFirstVisit();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  const handleRewardClick = (reward) => {
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const renderRewardItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleRewardClick(item)}
      style={styles.rewardCard}
    >
      {item.image && (
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.rewardImage}
        />
      )}
      <Text style={styles.rewardTitle}>{item.title}</Text>
      <View style={styles.price}>
        <Image source={require("../../assets/coin.png")} style={styles.coin} />
        <Text style={styles.rewardCost}>{item.coins} coins</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedReward && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                source={{ uri: selectedReward.image }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedReward.title}</Text>
              <View style={styles.price}>
                <Image
                  source={require("../../assets/coin.png")}
                  style={styles.coinRedeem}
                />

                <Text style={styles.modalCost}>{selectedReward.coins}</Text>
              </View>
              <TouchableOpacity
                style={styles.redeemButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.redeemButtonText}>Redeem now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <SafeAreaView>
        <ScrollView>
          {firstVisit ? (
            <View style={styles.welcome}>
              <Image source={require("../../assets/welcomrewarde.png")} />
              <Text style={styles.welcomeTitle}>Rewards</Text>
              <Text style={styles.welcomeText}>
                Win and choose rewards based on the amount of coins you earned
                by completing tasks
              </Text>
              <TouchableOpacity
                style={styles.firstVisitBtn}
                onPress={() => setFirstVisit(false)}
              >
                <Text style={styles.goBtn}>Let's go</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.headerText}>Rewards</Text>
              </View>
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
                      selectedCategory === category &&
                        styles.selectedCategoryButton,
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
                <View style={styles.rewardsContainer}>
                  {rewards
                    .filter(
                      (reward) =>
                        selectedCategory === "All" ||
                        reward.category === selectedCategory
                    )
                    .map((item) => renderRewardItem({ item, key: item.id }))}
                </View>
              )}
            </>
          )}
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
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    alignItems: "center",
    fontFamily: "Poppins",
  },
  goBtn: {
    fontSize: 20,
    textAlign: "center",
    alignItems: "center",
    fontFamily: "PoppinsBold",

    borderRadius: 15,
  },
  firstVisitBtn: {
    marginTop: 50,
    paddingVertical: 10,
    borderWidth: 1,
    paddingHorizontal: 30,
    backgroundColor: "#BEACFF",
    borderRadius: 15,
    shadowColor: "#030002",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 50,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  welcome: {
    marginVertical: "25%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 50,
  },
  headerText: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    textAlign: "left",
    paddingLeft: 20,
  },

  No: {
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFDA9E",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 50,
    marginTop: 20,
  },
  balanceText: {
    fontSize: 24,
    width: 100,
    fontFamily: "Poppins",
  },
  Balance: {
    flexDirection: "row",
  },
  coinIcon: {
    resizeMode: "contain",
    marginTop: 5,
    width: 60,
    height: 60,
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
    paddingHorizontal: 20,
    backgroundColor: "#dcd7ff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },
  selectedCategoryButton: {
    backgroundColor: "#dcd7ff",
    borderWidth: 1,
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },
  categoryButtonText: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  selectedCategoryButtonText: {
    color: "#3d3d3d",
  },

  row: {
    justifyContent: "space-between",
  },
  rewardCard: {
    backgroundColor: "#EDE8FF",
    width: 160,
    minHeight: 160,
    margin: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },

  rewardsContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  rewardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "PoppinsBold",
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
  price: {
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 4,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  modalCost: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "PoppinsSemiBold",
    color: "#3F3F3F",
  },
  coinRedeem: {
    resizeMode: "contain",
    width: 40,
    height: 30,
  },
  redeemButton: {
    backgroundColor: "#BEACFF",
    borderWidth: 1,
    width: "100%",
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    shadowColor: "#030002",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginBottom: 50,
  },

  redeemButtonText: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
});

export default Rewards;
