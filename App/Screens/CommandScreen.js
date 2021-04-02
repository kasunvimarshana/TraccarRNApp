import React, { Component, useState, useEffect } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    Text,
    ActivityIndicator,
    Snackbar,
    Modal,
    Portal
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';

import CustomTheme from '../Themes/CustomTheme';
import ButtonComponent from '../Components/ButtonComponent';
import TextInputComponent from '../Components/TextInputComponent';
import Title from '../Components/Title';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { commandSend } from '../Store/Actions/CommandAction';
import { fetchSelectedDevicePosition, updateSelectedDevice } from '../Store/Actions/DeviceAction';

class CommandScreen extends Component {

    state = {};

    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            object_type: null,
            isButtonDisabled_engineStop: false,
            isButtonDisabled_engineStart: false,
            isButtonDisabled_updateDistance: false,
            isButtonDisabled_updateDistance_modalShow: false,
            isSnackbarVisible: false,
            snackbarMessage: null,
            isModalVisible: false,
            distance: 0
        };

        this._position = null;
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;

        //Set Object Type
        this.setState({ object_type: this.props.object_type });
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
        //Set Object Type
        if (this.props.object_type !== nextProps.object_type) {
            this.setState({ object_type: nextProps.object_type });
        }
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    buttonOnPressHandler_engineStop = () => {
        this.setState({isButtonDisabled_engineStop: true});
        this.commandSend("engineStop", null)
        .then(() => {
            this.setState({isButtonDisabled_engineStop: false});
            this.snackbarShowHandler("Send Command Success, Engine Stop");
        },( reject ) => {
            throw new Error( "Error" );
        })
        .catch((error) => {
            console.log("error", error);
            /*
            this.setState({isButtonDisabled_engineStop: false});
            Alert.alert(
                'Error',
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
            */

            this.setState({isButtonDisabled_engineStop: false});
            this.snackbarShowHandler("Send Command Error, Please try again");
        });
    }

    buttonOnPressHandler_engineStart = () => {
        this.setState({isButtonDisabled_engineStart: true});
        this.commandSend("engineResume", null)
        .then(() => {
            this.setState({isButtonDisabled_engineStart: false});
            this.snackbarShowHandler("Send Command Success, Engine Resume");
        },( reject ) => {
            throw new Error( "Error" );
        })
        .catch((error) => {
            console.log("error", error);
            /*
            this.setState({isButtonDisabled_engineStart: false});
            Alert.alert(
                'Error',
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
            */
            
            this.setState({isButtonDisabled_engineStart: false});
            this.snackbarShowHandler("Send Command Error, Please try again");
        });
    }

    buttonOnPressHandler_updateDistance_modalShow = () => {
        this.setState({isButtonDisabled_updateDistance_modalShow: true});
        this.fetchSelectedDevicePosition()
        .then((position) => {
            //console.log(position);
            if( position !== null ){
                this.modalShowHandler( position.attributes.totalDistance );
                this.setState({isButtonDisabled_updateDistance_modalShow: false});
            }else{
                throw new Error("Error");
            }
        })
        .catch((error) => {
            console.log("error", error);
            this.setState({isButtonDisabled_updateDistance_modalShow: false});
            this.snackbarShowHandler("Can't get Device data, Please try again");
        });
    }

    buttonOnPressHandler_updateDistance = () => {
        this.setState({isButtonDisabled_updateDistance: true});
        this.updateSelectedDevice({totalDistance: this.state.distance}, "accumulators")
        .then(() => {
            this.setState({isButtonDisabled_updateDistance: false});
            this.modalDismissHandler();
            this.snackbarShowHandler("Send Command Success, Update Distance");
        },( reject ) => {
            throw new Error("Error");
        })
        .catch((error) => {
            console.log("error", error);
            /*
            this.setState({isButtonDisabled_updateDistance: false});
            Alert.alert(
                'Error',
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
            */
            
            this.setState({isButtonDisabled_updateDistance: false});
            this.modalDismissHandler();
            this.snackbarShowHandler("Send Command Error, Please try again");
        });
    }

    commandSend = ( type, attributes ) => {
        return this.props.ui_commandSend( type, attributes );
    }

    updateSelectedDevice = ( attributes, extraPathString ) => {
        return this.props.ui_updateSelectedDevice( attributes, extraPathString );
    }

    snackbarShowHandler = ( snackbarMessage = null ) => {
        this.setState({
            isSnackbarVisible: true,
            snackbarMessage: snackbarMessage
        });
    };

    snackbarToggleHandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isSnackbarVisible: !prevState.isSnackbarVisible
            }
        });
    };

    snackbarDismissHandler = () => {
        this.setState({
            isSnackbarVisible: false,
            //snackbarMessage: null
        });
    };

    modalShowHandler = ( distance = 0 ) => {
        this.setState({
            isModalVisible: true,
            distance: distance
        });
    };

    modalToggleHandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isModalVisible: !prevState.isModalVisible
            }
        });
    };

    modalDismissHandler = () => {
        this.setState({
            isModalVisible: false
        });
    };

    distanceOnChangeHandler = ( value ) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                distance: value
            }
        });
    }

    fetchSelectedDevicePosition = async () => {
        try{
            let position = await this.props.ui_fetchSelectedDevicePosition();
            this._position = this.formatPosition(position);
            console.log("this._position", this._position);
        }catch( error ){
            console.log("error", error);
            this._position = null;
        }
        return this._position;
    }

    formatPosition = ( position ) => {
        return {
            ...position
        }
    }

    render() {
        //const { colors } = this.props.theme;
        
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <StatusBar style="auto"/>

                    {
                        ( this.props.ui_selectedDevice !== null ) && 
                        ( <Title> { this.props.ui_selectedDevice.name } </Title> )
                    }

                    {
                        ( !this.state.isButtonDisabled_engineStop ) && 
                        (
                            <ButtonComponent 
                                onPress={() => this.buttonOnPressHandler_engineStop()} 
                                disabled={this.state.isButtonDisabled_engineStop} 
                                buttonViewStyle={styles.buttonComponent}> Engine Stop </ButtonComponent>
                        )
                    }

                    {
                        ( this.state.isButtonDisabled_engineStop ) && 
                        ( <ActivityIndicator animating={ this.state.isButtonDisabled_engineStop } color={colors.primary} size="large"/> )
                    }

                    {
                        ( !this.state.isButtonDisabled_engineStart ) && 
                        (
                            <ButtonComponent 
                                onPress={() => this.buttonOnPressHandler_engineStart()} 
                                disabled={this.state.isButtonDisabled_engineStart} 
                                buttonViewStyle={styles.buttonComponent}> Engine Resume </ButtonComponent>
                        )
                    }

                    {
                        ( this.state.isButtonDisabled_engineStart ) && 
                        ( <ActivityIndicator animating={ this.state.isButtonDisabled_engineStart } color={colors.primary} size="large"/> )
                    }

                    {
                        ( !this.state.isButtonDisabled_updateDistance_modalShow ) && 
                        (
                            <ButtonComponent 
                                onPress={() => this.buttonOnPressHandler_updateDistance_modalShow()} 
                                disabled={this.state.isButtonDisabled_updateDistance_modalShow} 
                                buttonViewStyle={styles.buttonComponent}> Update Distance </ButtonComponent>
                        )
                    }

                    {
                        ( this.state.isButtonDisabled_updateDistance_modalShow ) && 
                        ( <ActivityIndicator animating={ this.state.isButtonDisabled_updateDistance_modalShow } color={colors.primary} size="large"/> )
                    }

                    {
                        <Snackbar
                            visible={ this.state.isSnackbarVisible }
                            onDismiss={ this.snackbarDismissHandler }
                            action={{
                                label: 'Dismiss',
                                onPress: () => {
                                    this.snackbarDismissHandler()
                                },
                            }}>
                            { this.state.snackbarMessage }
                        </Snackbar>
                    }

                    {
                        <Portal>
                            <Modal 
                                visible={ this.state.isModalVisible } 
                                onDismiss={ this.modalDismissHandler } 
                                contentContainerStyle={ styles.modal }
                            >

                                <TextInputComponent
                                    placeholder="Distance..."
                                    placeholderTextColor={colors.placeholder}
                                    //defaultValue={String(this.state.distance)}
                                    defaultValue={`${this.state.distance}`}
                                    onChangeText={(distance) => this.distanceOnChangeHandler(distance)}
                                    autoFocus={false}
                                    inputViewStyle={styles.textInputComponent}
                                    keyboardType={ Platform.OS === 'android' ? "numeric" : "numbers-and-punctuation" }
                                    autoCorrect={false}
                                />

                                {
                                    ( !this.state.isButtonDisabled_updateDistance ) && 
                                    (
                                        <ButtonComponent 
                                            onPress={() => this.buttonOnPressHandler_updateDistance()} 
                                            disabled={this.state.isButtonDisabled_updateDistance} 
                                            buttonViewStyle={styles.buttonComponent}> Update Distance </ButtonComponent>
                                    )
                                }

                                {
                                    ( this.state.isButtonDisabled_updateDistance ) && 
                                    ( <ActivityIndicator animating={ this.state.isButtonDisabled_updateDistance } color={colors.primary} size="large"/> )
                                }

                            </Modal>
                        </Portal>
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
        marginBottom: 10,
        backgroundColor: colors.OrangePeel,
    },

    textInputComponent: {
        width: "80%",
        marginBottom: 10,
        backgroundColor: colors.DesertSand
    },

    modal: {
        backgroundColor: colors.background,
        padding: 20,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing,
        ui_selectedGroup: state.group.selectedGroup,
        ui_selectedDevice: state.device.selectedDevice
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_commandSend: ( type, attributes ) => dispatch(commandSend( type, attributes )),
        ui_fetchSelectedDevicePosition: () => dispatch(fetchSelectedDevicePosition()), 
        ui_updateSelectedDevice: ( attributes, extraPathString ) => dispatch(updateSelectedDevice( attributes, extraPathString ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(CommandScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( CommandScreen );
