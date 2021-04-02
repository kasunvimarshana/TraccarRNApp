import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    TextInput,
    Alert,
    InteractionManager
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

import CustomTheme from '../Themes/CustomTheme';
import HeaderTextComponent from '../Components/HeaderTextComponent';
import TextInputComponent from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { authSignIn, checkAuth } from '../Store/Actions/AuthAction';

class LoginScreen extends Component {

    _isMounted = false;
    
    state = {};

    constructor( props ) {
        super( props );
        this.state = {
            email: "",
            password: "",
            isButtonDisabled: false
        };
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;
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

        this.props.ui_authSignIn( params ).then(() => {
            return this.props.ui_checkAuth();
        })
        .then(() => {
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

    render() {
        //const { colors } = this.props.theme;
        
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <StatusBar style="auto"/>

                    <HeaderTextComponent>GPS APP</HeaderTextComponent>

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
    }

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_authSignIn: ( args ) => dispatch(authSignIn( args )),
        ui_checkAuth: () => dispatch(checkAuth())
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(LoginScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( LoginScreen );