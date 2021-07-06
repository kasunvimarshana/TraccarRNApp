import * as React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { 
    //Colors,
    Text,
    Modal, 
    ActivityIndicator
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

import CustomTheme from '../Themes/CustomTheme';

const Loader = ( props ) => {

    const {loading, ...attributes} = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => {
                console.log('onRequestClose');
            }}
        >
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={true}
                        color={colors.primary}
                        size="large"
                        style={styles.activityIndicator}
                    />
                </View>
            </View>
        </Modal>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},

    modalBackground: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.background
    },

    activityIndicatorWrapper: {
        backgroundColor: colors.background,
        height: 100,
        width: 100,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around"
    },

    activityIndicator: {
        alignItems: "center",
        height: 80
    },

});

export default Loader;