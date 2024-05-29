import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/Welcome";
import Signup from "../screens/ParentScreens/Signup";
import CreateFamilyScreen from "../screens/ParentScreens/CreateFamilyScreen";
import AddKidsScreen from "../screens/ParentScreens/AddKidsScreen";
import Index from "../screens/KidsScreens/Index";
import Home from "../screens/KidsScreens/Home";
import ChooseProfile from "../screens/ChooseProfile";
import HomeKid from "../screens/KidsScreens/HomeKid";
import KidsTabNavigator from "../screens/KidsScreens/KidsTabNavigator";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChoseProfileScreen">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateFamilyScreen"
          component={CreateFamilyScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddKidsScreen"
          component={AddKidsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChoseProfileScreen"
          component={ChooseProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="oldHomekids"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="KidsTabNavigator"
          component={KidsTabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default Navigation;
