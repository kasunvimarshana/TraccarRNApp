import * as React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    TextInput
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

import CustomTheme from '../Themes/CustomTheme';

const TextInputComponent = ( props ) => {

    const [inputValue, setInputValue] = React.useState(props.defaultValue);
    const [focus, setFocus] = React.useState(props.focus);

    const { inputViewStyle, ...textInputProps } = props;

    return (
        <View style={[styles.inputView, inputViewStyle]}>
            <TextInput
                {...textInputProps}
                placeholder={props.placeholder}
                placeholderTextColor={colors.placeholder}
                defaultValue={props.defaultValue}
                onChangeText={(text) => props.onChangeText(text)}
                style={[styles.inputText, props.style]}
                autoFocus={props.autoFocus}
                //onFocus={() => setFocus(true)}
                //onBlur={() => setFocus(false)}
                //setFocus={focus}
            />
        </View>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    inputView:{
        backgroundColor: CustomTheme.TiffanyBlue,
        borderRadius: 25,
        height: 50,
        justifyContent: "center",
        padding: 20
    },

    inputText:{
        height: 50,
        color: colors.text,
        backgroundColor: "transparent"
    }

});

export default TextInputComponent;