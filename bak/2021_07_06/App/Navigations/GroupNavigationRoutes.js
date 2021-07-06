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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTheme from '../Themes/CustomTheme';
import ReportScreen from '../Screens/Reports/ReportScreen';
import PositionScreen from '../Screens/Reports/PositionScreen';
import GroupNavigationHeaderComponent from '../Components/GroupNavigationHeaderComponent';

import { REPORT_OBJECT_TYPE_GROUP } from '../Constants/AppConstants';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const reportStack = ({ navigation }) => {

    const _reportScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_GROUP
        });
        return (<ReportScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="ReportScreen"
            screenOptions={{
                headerLeft: () => (
                    <GroupNavigationHeaderComponent navigationProps={navigation} />
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
                name="ReportScreen"
                component={(_reportScreen)}
                options={{
                    title: 'Report'
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // Prevent default action
                        //e.preventDefault();
                        // Do something with the `navigation` object
                        //navigation.navigate('Screen');
                    }
                })}
            />
        </Stack.Navigator>
    );
};

const positionStack = ({ navigation }) => {

    const _positionScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_GROUP
        });
        return (<PositionScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="PositionScreen"
            screenOptions={{
                headerLeft: () => ( null ),
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
                name="PositionScreen"
                component={_positionScreen}
                options={{
                    title: 'Position'
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // Prevent default action
                        //e.preventDefault();
                        // Do something with the `navigation` object
                        //navigation.navigate('Screen');
                    }
                })}
            />
        </Stack.Navigator>
    );
};

const GroupNavigationRoutes = ( props ) => {
    return (
        <BottomTab.Navigator
            initialRouteName="reportStack"
            tabBarOptions={{
                activeTintColor: colors.notification,
            }}
        >
            <BottomTab.Screen
                name="reportStack"
                component={reportStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="filter" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

            <BottomTab.Screen
                name="positionStack"
                component={positionStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="globe" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />
        </BottomTab.Navigator>
    );
};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {}
});

export default GroupNavigationRoutes;