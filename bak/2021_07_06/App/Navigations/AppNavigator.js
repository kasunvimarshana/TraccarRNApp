import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';


import SplashScreen from '../Screens/SplashScreen';
import LoginScreen from '../Screens/LoginScreen';
import DrawerNavigationRoutes from './DrawerNavigatorRoutes';
import DeviceNavigationRoutes from './DeviceNavigationRoutes';
import GroupNavigationRoutes from './GroupNavigationRoutes';

const Stack = createStackNavigator();

const AuthRoutes = () => {
    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="AuthRoutes"
                    component={AuthRoutes}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="DrawerNavigationRoutes"
                    component={DrawerNavigationRoutes}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="DeviceNavigationRoutes"
                    component={DeviceNavigationRoutes}
                    options={{headerShown: false}}
                />
                {/*
                <Stack.Screen
                    name="GroupNavigationRoutes"
                    component={GroupNavigationRoutes}
                    options={{headerShown: false}}
                />
                */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;