//import * as React from 'react';
import React, { Component, useState, useEffect, useCallback } from 'react';
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

export const TimePickerComponent = ( props ) => {

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
    const [dateTime, setDateTime] = useState( value );
    const [mode, setMode] = useState("time");
    const [isShow, setIsShow] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    //const useMount = func => useEffect(() => func(), []);
    
    useEffect(() => {
        let _isMounted = true;
        
        if( _isMounted ){
            //
            setDateTime(props.value);
        }

        //cleanup
        return () => { _isMounted = false };
    }, [ props.value ]);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const showMode = ( currentMode ) => {
        setIsShow( true );
        setMode( currentMode );
        forceUpdate();
    };

    const onChangeHandler = (event, selectedDateTime) => {
        let currentDateTime = null;
        let tempDateTime = null;
        if (selectedDateTime !== undefined) { 
            tempDateTime = moment(selectedDateTime, [moment.defaultFormat], true);
            if( tempDateTime.isValid() ){
                currentDateTime = moment(tempDateTime, [moment.defaultFormat], true).toDate();
            }
        }

        setIsShow(false);
        setDateTime(currentDateTime);
        onChange( currentDateTime );
    };

    const onPressHandler = () => {
        showMode( mode );
    };

    const getPlaceholder = () => {
        let tempPlaceholder = null;
        const tempDateTime = moment(dateTime, [moment.defaultFormat], true);
        if( tempDateTime.isValid() ){
            tempPlaceholder = tempDateTime.format("hh:mm A");
        }

        return tempPlaceholder || placeholder;
    };

    const getValue = () => {
        let defaultValue = null;
        const tempDateTime = moment(dateTime, [moment.defaultFormat], true);
        if( tempDateTime.isValid() ){
            defaultValue = tempDateTime.toDate();
        }

        return defaultValue || currentDateTime;
    };

    const renderDateTimePicker = ( show = false ) => {
        let dateTimePicker = null;

        if( show ){
            dateTimePicker = (
                <DateTimePicker
                    testID="dateTimePicker"
                    mode={mode} //date, time
                    is24Hour={false}
                    display="default" //default, spinner, calendar, clock
                    value={getValue()}
                    onChange={(event, date) => onChangeHandler(event, date)}
                    {...dateTimePickerProps}
                />
            );
        }

        return dateTimePicker;
    };

    return (
        <View style={[styles.dateTimePickerView, dateTimePickerViewStyle]}>
            <TouchableOpacity style={[styles.touchableOpacity]} onPress={() => onPressHandler()}>
                <Text style={[styles.text, placeholderStyle]}> {getPlaceholder()} </Text>
            </TouchableOpacity>
            {renderDateTimePicker( isShow )}
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

//export default TimePickerComponent;