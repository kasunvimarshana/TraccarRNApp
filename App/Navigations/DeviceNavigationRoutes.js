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
import SelectedDevicePositionScreen from '../Screens/Reports/SelectedDevicePositionScreen';
import SelectedDeviceDirectionScreen from '../Screens/Reports/SelectedDeviceDirectionScreen';
import ReportSummaryScreen from '../Screens/Reports/ReportSummaryScreen';
import CommandScreen from '../Screens/CommandScreen';
import HelpScreen from '../Screens/HelpScreen';
import ReportTripScreen from '../Screens/Reports/ReportTripScreen';
import EventScreen from '../Screens/Reports/EventScreen';
import DeviceNavigationHeaderComponent from '../Components/DeviceNavigationHeaderComponent';

import { REPORT_OBJECT_TYPE_DEVICE } from '../Constants/AppConstants';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const reportStack = ({ navigation }) => {

    const _reportScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<ReportScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="ReportScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<PositionScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="PositionScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="PositionScreen"
                component={_positionScreen}
                options={{
                    title: 'Playback'
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

const selectedDevicePositionStack = ({ navigation }) => {

    const _selectedDevicePositionScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<SelectedDevicePositionScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="SelectedDevicePositionScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="SelectedDevicePositionScreen"
                component={_selectedDevicePositionScreen}
                options={{
                    title: 'Live Tracking'
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

const selectedDeviceDirectionStack = ({ navigation }) => {

    const _selectedDeviceDirectionScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<SelectedDeviceDirectionScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="SelectedDeviceDirectionScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="SelectedDeviceDirectionScreen"
                component={_selectedDeviceDirectionScreen}
                options={{
                    title: 'Direction'
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

const reportSummaryStack = ({ navigation }) => {

    const _reportSummaryScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<ReportSummaryScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="ReportSummaryScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="ReportSummaryScreen"
                component={_reportSummaryScreen}
                options={{
                    title: 'Summary'
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

const commandStack = ({ navigation }) => {

    const _commandScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<CommandScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="CommandScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="CommandScreen"
                component={_commandScreen}
                options={{
                    title: 'Commands'
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

const helpStack = ({ navigation }) => {

    const _helpScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<HelpScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="HelpScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="HelpScreen"
                component={_helpScreen}
                options={{
                    title: 'Help'
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

const reportTripStack = ({ navigation }) => {

    const _reportTripScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<ReportTripScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="ReportTripScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="ReportTripScreen"
                component={_reportTripScreen}
                options={{
                    title: 'Trips'
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

const eventStack = ({ navigation }) => {

    const _eventScreen = ( props = {} ) => {
        props = Object.assign({}, props, {
            object_type: REPORT_OBJECT_TYPE_DEVICE
        });
        return (<EventScreen {...props}/>);
    };

    return (
        <Stack.Navigator 
            initialRouteName="EventScreen"
            screenOptions={{
                headerLeft: () => (
                    <DeviceNavigationHeaderComponent navigationProps={navigation} />
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
                name="EventScreen"
                component={_eventScreen}
                options={{
                    title: 'Events'
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

const DeviceNavigationRoutes = ( props ) => {
    return (
        <BottomTab.Navigator
            initialRouteName="selectedDevicePositionStack"
            tabBarOptions={{
                activeTintColor: colors.notification,
            }}
        >
            <BottomTab.Screen
                name="selectedDevicePositionStack"
                component={selectedDevicePositionStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="map-marker" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

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

            <BottomTab.Screen
                name="selectedDeviceDirectionStack"
                component={selectedDeviceDirectionStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="map-o" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

            <BottomTab.Screen
                name="reportSummaryStack"
                component={reportSummaryStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="list-alt" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

            <BottomTab.Screen
                name="reportTripStack"
                component={reportTripStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="road" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

            <BottomTab.Screen
                name="eventStack"
                component={eventStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="tripadvisor" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

            <BottomTab.Screen
                name="commandStack"
                component={commandStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="terminal" color={color} size={size} />
                    ),
                    unmountOnBlur: true,
                }}
            />

            <BottomTab.Screen
                name="helpStack"
                component={helpStack}
                options={{
                    tabBarLabel: () => {return null},
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="question-circle-o" color={color} size={size} />
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

export default DeviceNavigationRoutes;