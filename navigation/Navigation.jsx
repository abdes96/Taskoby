import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Adjust the path as necessary
import Welcome from "../screens/Welcome";
import Signup from "../screens/ParentScreens/Signup";
import CreateFamilyScreen from "../screens/ParentScreens/CreateFamilyScreen";
import AddKidsScreen from "../screens/ParentScreens/AddKidsScreen";
import ChooseProfile from "../screens/ChooseProfile";
import KidsTabNavigator from "../screens/KidsScreens/TabNavigator";
import Login from "../screens/Login";

const Stack = createStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Index" : "Index"}>
        {user ? (
          <>
            <Stack.Screen
              name="ChooseProfileScreen"
              component={ChooseProfile}
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
          </>
        ) : (
          <>
            <Stack.Screen
              name="Index"
              component={Login}
              options={{
                headerShown: false,
              }}
            />

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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
