//import * as React from 'react';
import React, { Component, useState, useEffect, useCallback, useRef } from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import CustomTheme from '../Themes/CustomTheme';

export const DEFAULT_FORMAT = moment.ISO_8601;

export const DateTimePickerComponent = ( props ) => {

    const { 
        dateTimePickerViewStyle, 
        placeholderStyle, 
        placeholder, 
        value, 
        onChange, 
        ...dateTimePickerProps 
    } = props;

    moment.defaultFormat = DEFAULT_FORMAT;
    const currentDateTime = moment().toDate();
    const [state, setState] = useState({
        dateTime: value,
        isVisible: false,
        currentMode: null
    });

    //const useMount = func => useEffect(() => func(), []);
    
    useEffect(() => {
        let _isMounted = true;
        
        if( _isMounted ){
            //
            setState((prevState) => {
                return {
                    ...prevState,
                    dateTime: props.value
                }
            });
        }

        //cleanup
        return () => { _isMounted = false };
    }, [ props.value ]);

    useEffect(() => {
        let _isMounted = true;
        
        if( _isMounted ){
            //
        }

        //cleanup
        return () => { _isMounted = false };
    }, []);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const showMode = ( mode ) => {
        setState((prevState) => {
            return {
                ...prevState,
                currentMode: mode,
                isVisible: true
            }
        });
        //forceUpdate();
    };

    const hideMode = () => {
        setState((prevState) => {
            return {
                ...prevState,
                currentMode: null,
                isVisible: false
            }
        });
        //forceUpdate();
    };

    const showDatePicker = () => {
        showMode("date");
    };

    const showTimePicker = () => {
        showMode("time");
    };

    const hideDatePicker = () => {
        hideMode();
    };

    const hideTimePicker = () => {
        hideMode();
    };

    const dateOnChangeHandler = (event, selectedDateTime) => {
        //setIsShow(Platform.OS === 'ios');
        let _dateTime_ = null;
        let tempDateTime = null;
        const defaultDateTime = moment(getValue(), [ moment.defaultFormat ], true).toObject();
        if (selectedDateTime !== undefined) { 
            tempDateTime = moment(selectedDateTime, [ moment.defaultFormat ], true);
            if( tempDateTime.isValid() ){
                tempDateTime = moment(tempDateTime, [ moment.defaultFormat ], true).toObject();
                const tempDTO = {
                    years: tempDateTime.years,
                    months: tempDateTime.months,
                    date: tempDateTime.date,
                    hours: defaultDateTime.hours,
                    minutes: defaultDateTime.minutes,
                    seconds: defaultDateTime.seconds,
                    milliseconds: defaultDateTime.milliseconds
                };
                tempDateTime = moment( tempDTO );
            }
            if( tempDateTime.isValid() ){
                _dateTime_ = tempDateTime.toDate();
            }
        }

        setState((prevState) => {
            return {
                ...prevState,
                dateTime: _dateTime_,
                currentMode: "time",
                isVisible: true
            }
        });
    };

    const timeOnChangeHandler = (event, selectedDateTime) => {
        //setIsShow(Platform.OS === 'ios');
        let _dateTime_ = null;
        let tempDateTime = null;
        const defaultDateTime = moment(getValue(), [ moment.defaultFormat ], true).toObject();
        if (selectedDateTime !== undefined) { 
            tempDateTime = moment(selectedDateTime, [ moment.defaultFormat ], true);
            if( tempDateTime.isValid() ){
                tempDateTime = moment(tempDateTime, [ moment.defaultFormat ], true).toObject();
                const tempDTO = {
                    years: defaultDateTime.years,
                    months: defaultDateTime.months,
                    date: defaultDateTime.date,
                    hours: tempDateTime.hours,
                    minutes: tempDateTime.minutes,
                    seconds: tempDateTime.seconds,
                    milliseconds: tempDateTime.milliseconds
                };
                tempDateTime = moment( tempDTO );
            }
            if( tempDateTime.isValid() ){
                _dateTime_ = tempDateTime.toDate();
            }
        }

        setState((prevState) => {
            return {
                ...prevState,
                dateTime: _dateTime_,
                currentMode: null,
                isVisible: false
            }
        });
        onChange(_dateTime_);
    };

    const onPressHandler = () => {
        showDatePicker();
    };

    const getPlaceholder = () => {
        let tempPlaceholder = null;
        const tempDateTime = moment(state.dateTime, [ moment.defaultFormat ], true);
        if( tempDateTime.isValid() ){
            tempPlaceholder = tempDateTime.format("YYYY-MM-DD hh:mm A");
        }

        return tempPlaceholder || placeholder;
    };

    const getValue = () => {
        let defaultValue = null;
        const tempDateTime = moment(state.dateTime, [ moment.defaultFormat ], true);
        if( tempDateTime.isValid() ){
            defaultValue = tempDateTime.toDate();
        }

        return defaultValue || currentDateTime;
    };

    const renderDatePicker = () => {
        let dateTimePicker = null;

        dateTimePicker = (state.isVisible && state.currentMode === "date") && (
            <DateTimePicker
                //testID="dateTimePicker"
                mode={state.currentMode} //date, time
                is24Hour={false}
                display="calendar" //default, spinner, calendar, clock
                value={getValue()}
                onChange={(event, _dateTime) => dateOnChangeHandler(event, _dateTime)}
                {...dateTimePickerProps}
            />
        );

        return dateTimePicker;
    };

    const renderTimePicker = () => {
        let dateTimePicker = null;

        dateTimePicker = (state.isVisible && state.currentMode === "time") && (
            <DateTimePicker
                //testID="dateTimePicker"
                mode={state.currentMode} //date, time
                is24Hour={false}
                display="clock" //default, spinner, calendar, clock
                value={getValue()}
                onChange={(event, _dateTime) => timeOnChangeHandler(event, _dateTime)}
                {...dateTimePickerProps}
            />
        );

        return dateTimePicker;
    };

    return (
        <View style={[styles.dateTimePickerView, dateTimePickerViewStyle]}>
            <TouchableOpacity style={[styles.touchableOpacity]} onPress={() => onPressHandler()}>
                <Text style={[styles.text, placeholderStyle]}> {getPlaceholder()} </Text>
            </TouchableOpacity>
            {(renderDatePicker())}
            {(renderTimePicker())}
        </View>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    dateTimePickerView:{
        backgroundColor: colors.TiffanyBlue,
        borderRadius: 25,
        height: 50,
        alignItems: "stretch",
        justifyContent: "center",
        paddingHorizontal: 20
    },

    touchableOpacity:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    text:{
        color: colors.text,
    }

});

//export default DateTimePickerComponent;