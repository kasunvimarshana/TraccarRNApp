import React, { Component, useState, useEffect } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions
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
import { DatePickerComponent, DEFAULT_FORMAT as DATE_DEFAULT_FORMAT } from '../../Components/DatePickerComponent';
import { TimePickerComponent, DEFAULT_FORMAT as TIME_DEFAULT_FORMAT } from '../../Components/TimePickerComponent';
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
            toDateTime: null,
            fromDate: null,
            fromTime: null,
            toDate: null,
            toTime: null
        };
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;

        //Set Object Type
        this.setState({ object_type: this.props.object_type });

        this.setState({ fromDateTime: this.props.ui_fromDateTime });
        this._setFromDate( this.props.ui_fromDateTime );
        this._setFromTime( this.props.ui_fromDateTime );

        this.setState({ toDateTime: this.props.ui_toDateTime });
        this._setToDate( this.props.ui_toDateTime );
        this._setToTime( this.props.ui_toDateTime );
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
            this.setState({ fromDateTime: nextProps.ui_fromDateTime });

            this._setFromDate( nextProps.ui_fromDateTime );
            this._setFromTime( nextProps.ui_fromDateTime );
        }

        if (String(this.props.ui_toDateTime) !== String(nextProps.ui_toDateTime)) {
            this.setState({ toDateTime: nextProps.ui_toDateTime });

            this._setToDate( nextProps.ui_toDateTime );
            this._setToTime( nextProps.ui_toDateTime );
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
    }

    fromDateChangeHandler = ( fromDate ) => {
        this._setFromDate( fromDate );
    }

    fromTimeChangeHandler = ( fromTime ) => {
        this._setFromTime( fromTime );
    }

    toDateChangeHandler = ( toDate ) => {
        this._setToDate( toDate );
    }

    toTimeChangeHandler = ( toTime ) => {
        this._setToTime( toTime );
    }

    _setFromDate = ( fromDate ) => {
        this.setState({fromDate: fromDate});
    }

    _setFromTime = ( fromTime ) => {
        this.setState({fromTime: fromTime});
    }

    _setToDate = ( toDate ) => {
        this.setState({toDate: toDate});
    }

    _setToTime = ( toTime ) => {
        this.setState({toTime: toTime});
    }

    setFromDateTime = () => {
        const currentDateTimeObject = moment().toObject();
        let fromDateTime = null;
        let fromDate = this.state.fromDate;
        let fromTime = this.state.fromTime;
        fromDate = moment(fromDate, [ DATE_DEFAULT_FORMAT ], true);
        fromTime = moment(fromTime, [ TIME_DEFAULT_FORMAT ], true);
        let fromDateObject = fromDate.toObject();
        let fromTimeObject = fromTime.toObject();
        const tempDTO = {
            years: ( Number.isNaN( fromDateObject.years ) ) ? currentDateTimeObject.years : fromDateObject.years,
            months: ( Number.isNaN( fromDateObject.months ) ) ? currentDateTimeObject.months : fromDateObject.months,
            date: ( Number.isNaN( fromDateObject.date ) ) ? currentDateTimeObject.date : fromDateObject.date,
            hours: ( Number.isNaN( fromTimeObject.hours ) ) ? currentDateTimeObject.hours : fromTimeObject.hours,
            minutes: ( Number.isNaN( fromTimeObject.minutes ) ) ? currentDateTimeObject.minutes : fromTimeObject.minutes,
            seconds: ( Number.isNaN( fromTimeObject.seconds ) ) ? currentDateTimeObject.seconds : fromTimeObject.seconds,
            milliseconds: ( Number.isNaN( fromTimeObject.milliseconds ) ) ? currentDateTimeObject.milliseconds : fromTimeObject.milliseconds
        };
        let tempDateTime = moment( tempDTO );
        if( tempDateTime.isValid() ){
            fromDateTime = tempDateTime.toDate();
        }
        this.props.ui_setFromDateTime( fromDateTime );
    }

    setToDateTime = () => {
        const currentDateTimeObject = moment().toObject();
        let toDateTime = null;
        let toDate = this.state.toDate;
        let toTime = this.state.toTime;
        toDate = moment(toDate, [ DATE_DEFAULT_FORMAT ], true);
        toTime = moment(toTime, [ TIME_DEFAULT_FORMAT ], true);
        let toDateObject = toDate.toObject();
        let toTimeObject = toTime.toObject();
        const tempDTO = {
            years: ( Number.isNaN( toDateObject.years ) ) ? currentDateTimeObject.years : toDateObject.years,
            months: ( Number.isNaN( toDateObject.months ) ) ? currentDateTimeObject.months : toDateObject.months,
            date: ( Number.isNaN( toDateObject.date ) ) ? currentDateTimeObject.date : toDateObject.date,
            hours: ( Number.isNaN( toTimeObject.hours ) ) ? currentDateTimeObject.hours : toTimeObject.hours,
            minutes: ( Number.isNaN( toTimeObject.minutes ) ) ? currentDateTimeObject.minutes : toTimeObject.minutes,
            seconds: ( Number.isNaN( toTimeObject.seconds ) ) ? currentDateTimeObject.seconds : toTimeObject.seconds,
            milliseconds: ( Number.isNaN( toTimeObject.milliseconds ) ) ? currentDateTimeObject.milliseconds : toTimeObject.milliseconds
        };
        let tempDateTime = moment( tempDTO );
        if( tempDateTime.isValid() ){
            toDateTime = tempDateTime.toDate();
        }
        this.props.ui_setToDateTime( toDateTime );
    }

    render() {
        //const { colors } = this.props.theme;
        
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <StatusBar style="auto"/>


                    <DatePickerComponent 
                        dateTimePickerViewStyle={styles.dateTimePickerComponent} 
                        placeholder="From Date"
                        value={ this.state.fromDate }
                        onChange={( value ) => this.fromDateChangeHandler( value )}
                    />

                    <TimePickerComponent
                        dateTimePickerViewStyle={styles.dateTimePickerComponent} 
                        placeholder="From Time"
                        value={ this.state.fromTime }
                        onChange={( value ) => this.fromTimeChangeHandler( value )}
                    />

                    <DatePickerComponent 
                        dateTimePickerViewStyle={styles.dateTimePickerComponent} 
                        placeholder="To Date"
                        value={ this.state.toDate }
                        onChange={( value ) => this.toDateChangeHandler( value )}
                    />

                    <TimePickerComponent
                        dateTimePickerViewStyle={styles.dateTimePickerComponent} 
                        placeholder="To Time"
                        value={ this.state.toTime }
                        onChange={( value ) => this.toTimeChangeHandler( value )}
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
        marginTop: 40,
        marginBottom: 10
    },

    buttonComponent: {
        width: "80%",
        marginTop: 40,
        marginBottom: 10,
        backgroundColor: colors.OrangePeel,
    }

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing,
        ui_fromDateTime: state.report.fromDateTime,
        ui_toDateTime: state.report.toDateTime
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
