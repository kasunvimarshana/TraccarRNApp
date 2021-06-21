import React, {Component, useState, useEffect} from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    ActivityIndicator,
    Subheading
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Constants from 'expo-constants';

import CustomTheme from '../Themes/CustomTheme';
import HeaderTextComponent from '../Components/HeaderTextComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { checkAuth } from '../Store/Actions/AuthAction';
import { 
    fetchDevices
} from '../Store/Actions/DeviceAction';

const SplashScreen = ( props ) => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        let _isMounted = true;

        const setTimeoutHandler = setTimeout(() => {
            //setAnimating(false);
            //Check if auth_tokent is set or not
            props.ui_checkAuth()
            .then(() => {
                props.navigation.replace("DrawerNavigationRoutes");
            })
            .catch((error) => {
                console.log("ui_checkAuth", error);
                props.navigation.replace("AuthRoutes");
            });
        }, 1000);

        //cleanup
        return () => { _isMounted = false };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <StatusBar style="auto"/>
                {/* <HeaderTextComponent> GPS APP </HeaderTextComponent> */}
                <Image
                    style={styles.image}
                    source={require('../Assets/images/splash_icon.png')}
                />
                <Subheading>V { Constants.manifest.version }</Subheading>
                <ActivityIndicator 
                    animating={isAnimating} 
                    color={colors.primary} 
                    size="large"
                    style={styles.activityIndicator}
                />
            </View>
        </SafeAreaView>
    );
};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: colors.background
    },
    
    contentContainer: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },

    activityIndicator: {},

    image: {},

    scrollView: {
        //flex: 1
    }
});


const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui?.isProcessing
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_checkAuth: () => dispatch(checkAuth()),
        ui_fetchDevices: () => dispatch(fetchDevices())
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(SplashScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( SplashScreen );