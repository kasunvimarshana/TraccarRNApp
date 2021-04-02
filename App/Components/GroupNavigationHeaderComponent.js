import * as React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { 
    Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import CustomTheme from '../Themes/CustomTheme';

const GroupNavigationHeaderComponent = ( props ) => {

    const goBackHandler = () => {
        console.log("goBackHandler");
        props.navigationProps.replace('DrawerNavigationRoutes', {
            screen: 'groupScreenStack',
            initial: true,
            params: {}
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goBackHandler}>
                <View style={styles.view}>
                    <FontAwesome name="arrow-circle-left" size={25} color={Colors.white} />
                </View>
            </TouchableOpacity>
        </View>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },

    view: {
        marginLeft: 5
    }
});

export default GroupNavigationHeaderComponent;