import * as React from 'react';
import { 
    StyleSheet,
    View,
    Platform,
    Dimensions,
    StatusBar
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

import CustomTheme from '../Themes/CustomTheme';

const Title = ( props ) => {

    return (
        <Text style={[styles.text, props.style]}> {props.children} </Text>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    text: {
        fontWeight: "bold",
        fontSize: 25,
        color: colors.primary,
        marginBottom: 40,
        flexWrap: "wrap",
        position: "absolute",
        top: 0,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }

});

export default Title;