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
    Text,
    IconButton
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
        currentMode: "date"
    });

    const _isMountedRef = useRef(false);

    //const useMount = func => useEffect(() => func(), []);
    
    useEffect(() => {
        _isMountedRef.current = true;
        
        if( _isMountedRef.current ){
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
        _isMountedRef.current = true;
        
        if( _isMountedRef.current ){
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
    };

    const hideMode = () => {
        setState((prevState) => {
            return {
                ...prevState,
                currentMode: null,
                isVisible: false
            }
        });
    };

    const showDatePicker = () => {
        showMode("date");
    };

    const showTimePicker = () => {
        showMode("time");
    };

    const dateOnChangeHandler = (event, selectedDateTime) => {
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

            setState((prevState) => {
                return {
                    ...prevState,
                    dateTime: _dateTime_
                }
            });
            showTimePicker();
        }else{
            setState((prevState) => {
                return {
                    ...prevState,
                    dateTime: _dateTime_,
                    currentMode: "date",
                    isVisible: false
                }
            });
            onChange(_dateTime_);
        }
    };

    const timeOnChangeHandler = (event, selectedDateTime) => {
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
                currentMode: "date",
                isVisible: false
            }
        });
        onChange(_dateTime_);
    };

    const onChangeHandler = ( event, selectedValue ) => {
        // setState((prevState) => {
        //     return {
        //         ...prevState,
        //         isVisible: Platform.OS === "ios"
        //     }
        // });
        if ( state.currentMode == "date" ) {
            dateOnChangeHandler(event, selectedValue);
        } else {
            timeOnChangeHandler(event, selectedValue);
        }
    }

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

    return (
        <React.Fragment>
            <View 
                style={[styles.dateTimePickerView, dateTimePickerViewStyle]}
            >
                <View style={styles.dateTimeView}>
                    <TouchableOpacity style={[styles.touchableOpacity]} onPress={() => onPressHandler()} disabled={state.isVisible}>
                        <Text style={[styles.text, placeholderStyle]}> {getPlaceholder()} </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.timeView}>
                    <IconButton
                        icon="clock-outline"
                        color={colors.text}
                        size={20}
                        onPress={() => showTimePicker()}
                    />
                </View>
            </View>
            {
                (state && state.isVisible === true) && 
                (
                    <DateTimePicker
                        testID="dateTimePicker"
                        //timeZoneOffsetInMinutes={0}
                        mode={state.currentMode} //date, time
                        is24Hour={false}
                        display="default" //default, spinner, calendar, clock
                        value={getValue()}
                        onChange={ onChangeHandler }
                        {...dateTimePickerProps}
                    />
                )
            }
        </React.Fragment>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    dateTimePickerView:{
        flex: 0,
        flexWrap: "nowrap",
        flexDirection: "row",
        backgroundColor: colors.TiffanyBlue,
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        alignContent: "center",
    },

    touchableOpacity:{
        flex: 1,
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center",
        margin: 5
    },

    text:{
        color: colors.text,
    },

    dateTimeView: {
        flex: 7, 
        flexBasis: "auto",
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center"
    },

    timeView: {
        flex: 1,  
        flexBasis: "auto",
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center"
    }

});

//export default DateTimePickerComponent;