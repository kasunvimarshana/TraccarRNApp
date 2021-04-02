import * as React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

import CustomTheme from '../Themes/CustomTheme';

const ButtonComponent = ( props ) => {

    const { buttonViewStyle, buttonTextStyle, ...buttonProps } = props;

    return (
        <TouchableOpacity style={[styles.buttonView, buttonViewStyle]} {...buttonProps}>
            <Text style={[styles.buttonText, buttonTextStyle]}> {props.children} </Text>
        </TouchableOpacity>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    buttonView:{
        backgroundColor: colors.TiffanyBlue,
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },

    buttonText:{
        color: colors.text,
    }

});

export default ButtonComponent;