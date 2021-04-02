import * as React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomTheme from '../Themes/CustomTheme';
import DeviceScreen from '../Screens/DeviceScreen';
import GroupScreen from '../Screens/GroupScreen';
import GroupDeviceScreen from '../Screens/GroupDeviceScreen';
import UserScreen from '../Screens/UserScreen';
import CustomSidebarMenu from '../Components/CustomSidebarMenu';
import NavigationDrawerHeader from '../Components/NavigationDrawerHeader';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const deviceScreenStack = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName="DeviceScreen">
            <Stack.Screen
                name="DeviceScreen"
                component={DeviceScreen}
                options={{
                    title: 'Devices',
                    headerLeft: () => (
                        <NavigationDrawerHeader navigationProps={navigation} />
                    ),
                    headerStyle: {
                        backgroundColor: colors.TiffanyBlue
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }}
            />
        </Stack.Navigator>
    );
};
  
const groupScreenStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            initialRouteName="GroupScreen"
            screenOptions={{
                headerLeft: () => (
                    <NavigationDrawerHeader navigationProps={navigation} />
                ),
                headerStyle: {
                    backgroundColor: colors.TiffanyBlue,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
            }}
        >
            <Stack.Screen
                name="GroupScreen"
                component={GroupScreen}
                options={{
                    title: 'Groups'
                }}
            />
        </Stack.Navigator>
    );
};

const groupDeviceScreenStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            initialRouteName="GroupDeviceScreen"
            screenOptions={{
                headerLeft: () => (
                    <NavigationDrawerHeader navigationProps={navigation} />
                ),
                headerStyle: {
                    backgroundColor: colors.TiffanyBlue,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
            }}
        >
            <Stack.Screen
                name="GroupDeviceScreen"
                component={GroupDeviceScreen}
                options={{
                    title: 'Group Devices'
                }}
            />
        </Stack.Navigator>
    );
};

const userScreenStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            initialRouteName="UserScreen"
            screenOptions={{
                headerLeft: () => (
                    <NavigationDrawerHeader navigationProps={navigation} />
                ),
                headerStyle: {
                    backgroundColor: colors.TiffanyBlue,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
            }}
        >
            <Stack.Screen
                name="UserScreen"
                component={UserScreen}
                options={{
                    title: 'Users'
                }}
            />
        </Stack.Navigator>
    );
};

const DrawerNavigatorRoutes = ( props ) => {
    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: colors.notification,
                color: colors.notification,
                itemStyle: styles.drawerContentItemStyle,
                labelStyle: styles.drawerContentLabelStyle,
            }}
            screenOptions={{headerShown: false}}
            drawerContent={(props) => { return (<CustomSidebarMenu {...props}/>) }}>
            {/*
            <Drawer.Screen
                name="deviceScreenStack"
                options={{drawerLabel: 'Devices'}}
                component={deviceScreenStack}
            />
            <Drawer.Screen
                name="groupScreenStack"
                options={{drawerLabel: 'Groups'}}
                component={groupScreenStack}
            />
            */}
            <Drawer.Screen
                name="groupDeviceScreenStack"
                options={{drawerLabel: 'Group Devices'}}
                component={groupDeviceScreenStack}
            />
            {/*
            <Drawer.Screen
                name="userScreenStack"
                options={{drawerLabel: 'Users'}}
                component={userScreenStack}
            />
            */}
        </Drawer.Navigator>
    );
};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    drawerContentItemStyle: {
        marginVertical: 5, 
        color: colors.text
    },

    drawerContentLabelStyle: {
        color: colors.text
    }

});

export default DrawerNavigatorRoutes;