//import * as React from 'react';
import React, { PureComponent } from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    Platform,
    Animated,
    Image
} from 'react-native';
import { 
    //Colors,
    Text,
    Card, 
    Title, 
    Paragraph,
    Avatar
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';

import CustomTheme from '../Themes/CustomTheme';
const markerImage = require('../Assets/images/icons_street_view_0.png'); //flag-blue.png, car_5.png, icons_street_view_0.png

export default class CustomMarker extends PureComponent {

    _markerImage = markerImage;

    constructor( props ) {
        super( props );
        this.state = {
            tracksViewChanges: true,
        };
        this._markerImage = ( props.markerImage ) ? props.markerImage : markerImage;
    }

    //componentWillReceiveProps(nextProps) {
    //    if (this.shouldUpdate(nextProps)) {
    //        this.setState(() => ({
    //            tracksViewChanges: true,
    //        }));
    //    }
    //}

    //shouldUpdate = (nextProps) => { 
    //    //TODO implement
    //}

    stopTrackingViewChanges = () => {
        this.setState(() => ({
            tracksViewChanges: false,
        }));
    }

    render() {
        const { tracksViewChanges } = this.state;
        const { coordinate } = this.props;
        const { data } = this.props;
        return (
            <Marker
                coordinate={ coordinate }
                tracksViewChanges={ tracksViewChanges }
                centerOffset={{ x: 0, y: 0 }}
                anchor={{ x: 0.5, y: 0.5 }}
                calloutOffset={{ x: 0, y: 0 }}
                calloutAnchor={{ x: 0.5, y: 0 }}
                //image={ this._markerImage }
                //icon={ this._markerImage }
            >
                <View style={ styles.container }>
                    <View>
                        {data.deviceTimeText !== undefined && <Text style={ styles.text }> Device Time : { data.deviceTimeText } </Text>}
                        {data.speedText !== undefined && <Text style={ styles.text }> Speed : { data.speedText } </Text>}
                        {data.address !== null && <Text style={ styles.text }> Address : { data.address } </Text>}
                    </View>
                    <Image
                        //onLoad={ this.stopTrackingViewChanges }
                        //fadeDuration={ 0 }
                        style={ styles.image }
                        source={ this._markerImage }
                    />
                </View>
            </Marker>
        );
    }
}

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.transparent,
        borderColor: colors.transparent,
        //elevation: 10,
        paddingBottom: 25
    },

    image: {
        width: 25,
        height: 25
    },

    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //borderWidth: 1,
        //borderColor: colors.transparent,
        //backgroundColor: colors.transparent,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

    text: {
        fontWeight: "bold",
        color: colors.text
    }
});