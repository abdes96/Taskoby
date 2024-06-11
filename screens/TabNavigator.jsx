import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';
import ProfileTab from "./Profile";
import { Platform, View, StyleSheet } from "react-native";
import Tasks from "./Tasks";
import Rewards from "./Rewards";
import Homekid from "./HomeKid";

const Tab = createBottomTabNavigator();

function KidsTabNavigator({ route }) {
  const { profile } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 100 : 70,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarActiveTintColor: "#BEACFF",
        tabBarInactiveTintColor: "#A0AAB8",
      }}
    >
      <Tab.Screen
        name="Homekid"
        component={Homekid}
        initialParams={{ profile }}
        options={{
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <View style={focused ? styles.activeIcon : null}>
                <Entypo name="home" size={focused ? 40 : 30} color={color} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        initialParams={{ profile }}
        options={{
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <View style={focused ? styles.activeIcon : null}>
                <FontAwesome
                  name="sticky-note"
                  size={focused ? 40 : 30}
                  color={color}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={Rewards}
        initialParams={{ profile }}
        options={{
          tabBarIcon: ({ color, focused, size }) => {
            return (
              <View style={focused ? styles.activeIcon : null}>
                <FontAwesome6
                    name="coins"
                    size={focused ? 40 : 30}
                    color= {color}
                  />
              </View>
            );
          },
        }}
      />
        <Tab.Screen
          name="Profile"
          component={ProfileTab}
          initialParams={{ profile }}
          options={{
            tabBarIcon: ({ color, focused, size }) => {
              return (
                <View style={focused ? styles.activeIcon : null}>
                  <FontAwesome
                    name={"user"}
                    size={focused ? 40 : 30}
                    color={color}
                  />
                </View>
              );
            },
          }}
        />
        
    
      
    </Tab.Navigator>
  );
}

export default KidsTabNavigator;

const styles = StyleSheet.create({
  activeIcon: {
    padding: 5,
    borderTopWidth: 3,
    borderTopColor: "#BEACFF",
  },
});
