import React, { Component, useState, useEffect } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';

import CustomTheme from '../../Themes/CustomTheme';
import { DateTimePickerComponent, DEFAULT_FORMAT as DATE_TIME_DEFAULT_FORMAT } from '../../Components/DateTimePickerComponent';
import ButtonComponent from '../../Components/ButtonComponent';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { setFromDateTime, setToDateTime } from '../../Store/Actions/Reports/ReportAction';
//import { DATE_TIME_DEFAULT_FORMAT } from '../../Constants/AppConstants';

class ReportScreen extends Component {

    state = {};

    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            object_type: null,
            fromDateTime: null,
            toDateTime: null
        };
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;

        //Set Object Type
        this.setState({ object_type: this.props.object_type });

        this._setFromDateTime( this.props.ui_fromDateTime );
        this._setToDateTime( this.props.ui_toDateTime );
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

        if (String(this.props.ui_fromDateTime) !== String(nextProps.ui_fromDateTime)) {
            this._setFromDateTime( nextProps.ui_fromDateTime );
        }

        if (String(this.props.ui_toDateTime) !== String(nextProps.ui_toDateTime)) {
            this._setToDateTime( nextProps.ui_toDateTime );
        }
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    buttonOnPressHandler = () => {
        this.setFromDateTime();
        this.setToDateTime();
        this.props.navigation.replace("DeviceNavigationRoutes", {
            screen: 'positionStack',
            initial: true,
            params: {}
        });
    }

    fromDateTimeChangeHandler = ( fromDateTime ) => {
        this._setFromDateTime( fromDateTime );
    }

    toDateTimeChangeHandler = ( toDateTime ) => {
        this._setToDateTime( toDateTime );
    }

    _setFromDateTime = ( fromDateTime ) => {
        this.setState({fromDateTime: fromDateTime});
    }

    _setToDateTime = ( toDateTime ) => {
        this.setState({toDateTime: toDateTime});
    }

    setFromDateTime = () => {
        let fromDateTime = null;
        let _fromDateTime = this.state.fromDateTime;
        _fromDateTime = moment(_fromDateTime, [ DATE_TIME_DEFAULT_FORMAT ], true);
        if( _fromDateTime.isValid() ){
            fromDateTime = _fromDateTime.toDate();
        }
        this.props.ui_setFromDateTime( fromDateTime );
    }

    setToDateTime = () => {
        let toDateTime = null;
        let _toDateTime = this.state.toDateTime;
        _toDateTime = moment(_toDateTime, [ DATE_TIME_DEFAULT_FORMAT ], true);
        if( _toDateTime.isValid() ){
            toDateTime = _toDateTime.toDate();
        }
        this.props.ui_setToDateTime( toDateTime );
    }

    buttonOnPressHandler_Today = () => {
        const currentDateTime = moment();
        let fromDateTime = currentDateTime.clone().startOf('date');
        let toDateTime = currentDateTime.clone().endOf('date');
        fromDateTime = fromDateTime.toDate();
        toDateTime = toDateTime.toDate();
        this._setFromDateTime( fromDateTime );
        this._setToDateTime( toDateTime );
    }
    
    buttonOnPressHandler_ThisWeek = () => {
        const currentDateTime = moment();
        let fromDateTime = currentDateTime.clone().startOf('week');
        let toDateTime = currentDateTime.clone().endOf('week');
        fromDateTime = fromDateTime.toDate();
        toDateTime = toDateTime.toDate();
        this._setFromDateTime( fromDateTime );
        this._setToDateTime( toDateTime );
    }

    buttonOnPressHandler_ThisMonth = () => {
        const currentDateTime = moment();
        let fromDateTime = currentDateTime.clone().startOf('month');
        let toDateTime = currentDateTime.clone().endOf('month');
        fromDateTime = fromDateTime.toDate();
        toDateTime = toDateTime.toDate();
        this._setFromDateTime( fromDateTime );
        this._setToDateTime( toDateTime );
    }

    render() {
        //const { colors } = this.props.theme;
        
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <StatusBar style="auto"/>

                    <ButtonComponent 
                        onPress={() => this.buttonOnPressHandler_Today()} 
                        //disabled={this.state.isButtonDisabled} 
                        buttonViewStyle={styles.buttonComponentDT}> Today </ButtonComponent>

                    <ButtonComponent 
                        onPress={() => this.buttonOnPressHandler_ThisWeek()} 
                        //disabled={this.state.isButtonDisabled} 
                        buttonViewStyle={styles.buttonComponentDT}> This Week </ButtonComponent>

                    <ButtonComponent 
                        onPress={() => this.buttonOnPressHandler_ThisMonth()} 
                        //disabled={this.state.isButtonDisabled} 
                        buttonViewStyle={styles.buttonComponentDT}> This Month </ButtonComponent>

                    <DateTimePickerComponent
                        dateTimePickerViewStyle={styles.dateTimePickerComponent} 
                        placeholder="From Date Time"
                        value={ this.state.fromDateTime }
                        onChange={( value ) => this.fromDateTimeChangeHandler( value )}
                    />

                    <DateTimePickerComponent
                        dateTimePickerViewStyle={styles.dateTimePickerComponent} 
                        placeholder="To Date Time"
                        value={ this.state.toDateTime }
                        onChange={( value ) => this.toDateTimeChangeHandler( value )}
                    />

                    <ButtonComponent 
                        onPress={() => this.buttonOnPressHandler()} 
                        disabled={this.state.isButtonDisabled} 
                        buttonViewStyle={styles.buttonComponent}> Filter </ButtonComponent>

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

    dateTimePickerComponent: {
        width: "80%",
        marginTop: 20,
        marginBottom: 5
    },

    buttonComponent: {
        width: "80%",
        marginTop: 40,
        marginBottom: 10,
        backgroundColor: colors.OrangePeel,
    },

    buttonComponentDT: {
        width: "80%",
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: colors.AntiqueBrass,
    },

    scrollView: {
        //flex: 1
    }

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui?.isProcessing,
        ui_fromDateTime: state.report?.fromDateTime,
        ui_toDateTime: state.report?.toDateTime
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_setFromDateTime: ( fromDateTime ) => dispatch(setFromDateTime( fromDateTime )),
        ui_setToDateTime: ( toDateTime ) => dispatch(setToDateTime( toDateTime ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(ReportScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( ReportScreen );
