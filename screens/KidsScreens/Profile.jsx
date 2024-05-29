import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileTab = () => {
  // Mock data for coins, today's task completion, and available awards
  const coins = 50;
  const tasksCompleted = 3;
  const totalTasks = 5;
  const completionPercentage = (tasksCompleted / totalTasks) * 100;
  const awards = [
    { name: 'Attraction Park', cost: 20, image: require('../../assets/attraction_park.jpg') },
    { name: 'Cinema', cost: 30, image: require('../../assets/cinema.jpg') },
    { name: 'Ice Cream', cost: 10, image: require('../../assets/ice_cream.jpg') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/hero1.jpg')} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>JohnDoe123</Text>
          <Text style={styles.level}>Level 5</Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="pencil" size={30} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Coins: {coins}</Text>
        
        <Text style={styles.statsText}>Today's Tasks: {tasksCompleted}/{totalTasks}</Text>
        <Text style={styles.statsText}>Rank: 5th</Text>
      </View>

      <View style={styles.awardsContainer}>
        <Text style={styles.sectionTitle}>Available Awards</Text>
        {awards.map((award, index) => (
          <View key={index} style={styles.awardItem}>
            <Image source={award.image} style={styles.awardImage} />
            <View>
              <Text>{award.name}</Text>
              <Text>{award.cost} Coins</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  level: {
    fontSize: 14,
    color: 'gray',
  },
  editIcon: {
    marginLeft: 'auto',
  },
  statsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#62D2C3',
  },
  awardsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  awardItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  awardImage: {
    width: 150,
    height: 100,
    marginRight: 10,
  },
});

export default ProfileTab;
