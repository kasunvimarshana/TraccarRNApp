//import * as React from 'react';
import React, { useCallback } from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    Alert
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import { useDispatch, useSelector, useStore } from 'react-redux';

import CustomTheme from '../Themes/CustomTheme';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { checkAuth, authSignOut } from '../Store/Actions/AuthAction';

const CustomSidebarMenu = ( props ) => {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(authSignOut())
        .then(() => {
            return dispatch(checkAuth());
        })
        .then(() => {
            console.log("logoutHandler");
        })
        .catch((error) => {
            console.log("logoutHandler", error);
            props.navigation.replace("SplashScreen");
        })
    }

    return (
        <View style={styles.sideMenuContainer}>
            <View style={styles.profileHeader}>
                <View style={styles.profileHeaderPicCircle}>
                    <Text style={styles.profileHeaderTextCircle}>
                        {'GPS'.charAt(0)}
                    </Text>
                </View>
                <Text style={styles.profileHeaderText}> Globe Vehicle Tracking </Text>
            </View>
            <View style={styles.profileHeaderLine} />

            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label={({color}) => <Text style={styles.drawerItemLabelText}> Logout </Text>}
                    onPress={() => {
                        props.navigation.toggleDrawer();
                        Alert.alert(
                            'Logout',
                            'Are you sure? You want to logout?',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => {
                                        return null;
                                    },
                                },
                                {
                                    text: 'Confirm',
                                    onPress: () => {
                                        logoutHandler();
                                    },
                                },
                            ],
                            { cancelable: false },
                        );
                    }}
                />
            </DrawerContentScrollView>
        </View>
    );
};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    sideMenuContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        paddingTop: 40,
        color: colors.text
    },

    profileHeader: {
        flexDirection: "row",
        backgroundColor: colors.background,
        padding: 15,
        textAlign: "center",
    },

    profileHeaderPicCircle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        color: colors.text,
        backgroundColor: colors.TiffanyBlue,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },

    profileHeaderTextCircle: {
        fontSize: 25, 
        color: colors.text
    },

    profileHeaderText: {
        color: colors.text,
        alignSelf: "center",
        paddingHorizontal: 10,
        fontWeight: "bold",
    },

    profileHeaderLine: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: colors.primary,
        marginTop: 15,
    },

    drawerItemLabelText: {
        color: colors.text
    }

});

export default CustomSidebarMenu;