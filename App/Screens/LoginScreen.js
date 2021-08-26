import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    TextInput,
    Alert,
    InteractionManager,
    ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    Text,
    ActivityIndicator
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';

import CustomTheme from '../Themes/CustomTheme';
import HeaderTextComponent from '../Components/HeaderTextComponent';
import TextInputComponent from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { authSignIn, checkAuth } from '../Store/Actions/AuthAction';
import { getSetting, saveSetting, deleteSetting } from '../Store/Actions/SettingAction';
import { getExpoPushTokenAsync, getDevicePushTokenAsync, storeNotificationData } from '../Store/Actions/NotificationAction';
import { KEY_REMOTE_LOCATION_API_ORIGIN } from '../Constants/AppConstants';

class LoginScreen extends Component {

    _isMounted = false;
    
    state = {};

    constructor( props ) {
        super( props );
        this.state = {
            email: "",
            password: "",
            isButtonDisabled: false,
            remote_location_api_origin: null,
            remoteLocationAPIOriginList: Constants.manifest.extra.remoteLocationAPIOriginList
        };
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;

        this.getSetting( KEY_REMOTE_LOCATION_API_ORIGIN )
        .then(( remote_location_api_origin ) => {
            this.setState({
                remote_location_api_origin: remote_location_api_origin
            });
        });

    }

    componentDidUpdate(prevProps) {
        // Listen Props Change
        if (prevProps.isFocused !== this.props.isFocused) {
            // Use the `this.props.isFocused` boolean
            // Call any action
        }
    }

    componentWillUnmount() {
        // Clean up listener
        this._isMounted = false;

        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    componentDidCatch(error, info) { 
        // logToExternalService may make an API call. 
        console.log(info.componentStack);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Any time props changes, update state.
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    emailOnChangeHandler = ( value ) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                email: value
            }
        });
    }

    passwordOnChangeHandler = ( value ) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                password: value
            }
        });
    }

    buttonOnPressHandler = () => {
        this.setState({isButtonDisabled: true});
        const params = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.ui_saveSetting({
            key: KEY_REMOTE_LOCATION_API_ORIGIN,
            value: this.state.remote_location_api_origin
        })
        .then(() => {
            return this.props.ui_authSignIn( params );
        })
        .then(() => {
            return this.props.ui_checkAuth();
        })
        .then(async () => {
            await this.getPushTokenData().then((data) => {
                return this.props.ui_storeNotificationData(data)
                .then((response) => {
                    //console.log('response', response);
                },
                (error) => {
                    throw new Error( error );
                });
            })
            .catch((error) => {
                console.log("error", error);
            });

            this.setState({isButtonDisabled: false});
            this.props.navigation.replace("DrawerNavigationRoutes");
        })
        .catch((error) => {
            console.log("ui_authSignIn", error);
            this.setState({isButtonDisabled: false});
            Alert.alert(
                'Authentication Error',
                'Please try again',
                [
                    {
                        text: 'Ok', 
                        onPress: () => {
                            //console.log('Ok');
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    }

    pickerOnValueChangeHandler = ( itemValue, itemIndex ) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                remote_location_api_origin: itemValue
            }
        });
    }

    getSetting = ( key ) => {
        return this.props.ui_getSetting(key);
    }

    getPushTokenData = async () => {
        // getExpoPushTokenAsync
        const expoPushToken = await this.props.ui_getExpoPushTokenAsync();
        // getDevicePushTokenAsync
        const devicePushToken = await this.props.ui_getDevicePushTokenAsync();

        return {
            expoPushToken: expoPushToken,
            devicePushToken: devicePushToken
        }
    }

    render() {
        //const { colors } = this.props.theme;
        const remoteLocationAPIOriginList_Map = new Map(Object.entries(this.state.remoteLocationAPIOriginList));
        remoteLocationAPIOriginList_Map.set("Plese Select a Server", null);
        const remoteLocationAPIOriginList_Array = Array.from(remoteLocationAPIOriginList_Map, ([key, value]) => ({ key, value }));
        
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <StatusBar style="auto"/>

                    <HeaderTextComponent style={{textAlign: "center"}}>Globe Vehicle Tracking</HeaderTextComponent>

                    <TextInputComponent
                        placeholder="Email..."
                        placeholderTextColor={colors.placeholder}
                        defaultValue={this.state.email}
                        onChangeText={(email) => this.emailOnChangeHandler(email)}
                        autoFocus={false}
                        inputViewStyle={styles.textInputComponent}
                    />

                    <TextInputComponent
                        placeholder="Password..."
                        placeholderTextColor={colors.placeholder}
                        defaultValue={this.state.password}
                        onChangeText={(password) => this.passwordOnChangeHandler(password)}
                        autoFocus={false}
                        secureTextEntry={true}
                        inputViewStyle={styles.textInputComponent}
                    />

                    <Picker
                        selectedValue={this.state.remote_location_api_origin}
                        onValueChange={(itemValue, itemIndex) => this.pickerOnValueChangeHandler(itemValue, itemIndex)}
                        style={styles.picker}
                    >
                        {
                            ( remoteLocationAPIOriginList_Array !== null ) && 
                            (
                                remoteLocationAPIOriginList_Array.map((value, index) => (  
                                    <Picker.Item key={ index } label={ value.key } value={ value.value }/>
                                ))
                            )
                        }
                    </Picker>

                    {
                        ( !this.state.isButtonDisabled ) && 
                        ( <ButtonComponent onPress={() => this.buttonOnPressHandler()} disabled={this.state.isButtonDisabled} buttonViewStyle={styles.buttonComponent}> Login  </ButtonComponent> )
                    }

                    {
                        ( this.state.isButtonDisabled ) && 
                        ( <ActivityIndicator animating={ this.state.isButtonDisabled } color={colors.primary} size="large"/> )
                    }

                </View>
            </SafeAreaView>
        );
    }

}

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

    buttonComponent: {
        width: "80%",
        marginTop: 40,
        marginBottom: 10
    },

    textInputComponent: {
        width: "80%",
        marginBottom: 20
    },

    picker: {
        width: "80%"
    },

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
        ui_authSignIn: ( args ) => dispatch(authSignIn( args )),
        ui_checkAuth: () => dispatch(checkAuth()),
        ui_getSetting: ( key ) => dispatch(getSetting( key )),
        ui_saveSetting: ( args ) => dispatch(saveSetting( args )),
        ui_getExpoPushTokenAsync: () => dispatch(getExpoPushTokenAsync()),
        ui_getDevicePushTokenAsync: () => dispatch(getDevicePushTokenAsync()),
        ui_storeNotificationData: ( data ) => dispatch(storeNotificationData( data )),
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(LoginScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( LoginScreen );