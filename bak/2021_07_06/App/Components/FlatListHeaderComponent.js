import * as React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

import CustomTheme from '../Themes/CustomTheme';
import TextInputComponent from '../Components/TextInputComponent';

const FlatListHeaderComponent = ( props ) => {

    const { onChangeText, ...etc } = props;

    const textOnChangeHandler = ( value ) => {
        onChangeText( value );
    }

    return (
        <TextInputComponent
            {...etc}
            placeholder="Search..."
            placeholderTextColor={colors.placeholder}
            onChangeText={(text) => textOnChangeHandler(text)}
            //autoFocus={false}
            //clearButtonMode="always"
        />
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},
});

export default FlatListHeaderComponent;