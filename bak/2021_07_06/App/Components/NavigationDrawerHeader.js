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

import CustomTheme from '../Themes/CustomTheme';
const draweIconURI = require('../Assets/images/drawer_white.png');

const NavigationDrawerHeader = ( props ) => {

    const toggleDrawer = () => {
        console.log("toggleDrawer");
        props.navigationProps.toggleDrawer();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleDrawer}>
                <Image
                    source={ draweIconURI }
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },

    image: {
        width: 25,
        height: 25,
        marginLeft: 5
    }

});

export default NavigationDrawerHeader;