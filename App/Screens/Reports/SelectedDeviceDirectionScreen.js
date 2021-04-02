import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    Text,
    ActivityIndicator
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, ProviderPropType, AnimatedRegion, MAP_TYPES, PROVIDER_DEFAULT } from 'react-native-maps';
import moment from 'moment';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';

import CustomTheme from '../../Themes/CustomTheme';
import MarkerComponent from '../../Components/MarkerComponent';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { fetchSelectedDevicePosition } from '../../Store/Actions/DeviceAction';
const markerImage_Device = require('../../Assets/images/car_5.png');

moment.defaultFormat = moment.ISO_8601;

class SelectedDeviceDirectionScreen extends Component {

    state = {};
    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            initialRegion: this.getInitialRegion(),
            region: this.getInitialRegion(),
            currentLocation: null,
            devicePosition: null
        };

        this.mapViewRef = React.createRef();
        this.markerRef = React.createRef();
        this._current_location = null;
        this._device_position = null;
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true;

        // fetchDirectionData
        this.fetchDirectionData().catch(( error ) => {
            console.log("error", error)
        });
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate");
        // Listen Props Change
        if (prevProps.isFocused !== this.props.isFocused) {
            // Use the `this.props.isFocused` boolean
            // Call any action
        }
    }

    componentWillUnmount() {
        //let className = this.constructor.name || Object.getOwnPropertyNames(this);
        console.log("componentWillUnmount");
        // Clean up listener
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    componentDidCatch(error, info) { 
        console.log("componentDidCatch");
        // logToExternalService may make an API call. 
        console.log(info.componentStack);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log("UNSAFE_componentWillReceiveProps");
        // Any time props changes, update state.
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    getInitialRegion = () => {
        return {
            latitude: -13.559158175078444,
            longitude: 34.2747814179254,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        };
    }

    getLocationAsync = async () => {
        let { status } = await Location.requestPermissionsAsync();
        let location = null;
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
        }else{
            location = await Location.getCurrentPositionAsync({});
        }
        
        return this._current_location = location;
    }

    fetchSelectedDevicePosition = async () => {
        let position = await this.props.ui_fetchSelectedDevicePosition();
        this._device_position = this.formatPosition(position);
        console.log("this._device_position", this._device_position);
        return this._device_position;
    }

    formatPosition = ( position ) => {
        if ( position.deviceTime !== undefined ) { 
            let tempDateTime = moment(position.deviceTime, [ moment.defaultFormat ], true);
            if( tempDateTime.isValid() ){
                position.deviceTime = tempDateTime.format("YYYY-MM-DD hh:mm A");
            }
        }
        if ( position.speed !== undefined ) { 
            position.speedText = (position.speed + " km/h");
        }
        return {
            ...position
        }
    }

    regionChangeHandler = ( region, isGesture ) => {
        console.log("regionChangeHandler", region, isGesture);
    }

    regionChangeCompleteHandler = ( region, isGesture ) => {
        console.log("regionChangeCompleteHandler", region, isGesture);
    }

    fetchDirectionData = async () => {
        const device_position = await this.fetchSelectedDevicePosition();
        const current_location = await this.getLocationAsync();

        console.log("device_position", device_position);
        console.log("current_location", current_location);
        //
        if ( this._isMounted ){
            if( (device_position !== null) && (current_location !== null) ){
                this.setState((prevState) => {
                    let tempRegion = Object.assign({}, prevState.region, current_location.coords);
                    return {
                        ...prevState,
                        region: tempRegion,
                        currentLocation: current_location,
                        devicePosition: device_position
                    }
                });
            }else{
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        currentLocation: null,
                        devicePosition: null
                    }
                });
            }
        }
    }

    getMarkerImage = () => {
        let markerImage = markerImage_Device;
        return markerImage;
    }

    render() {
        //const { colors } = this.props.theme;
        const markerImage = this.getMarkerImage();

        return(
            <React.Fragment>
                { console.log("Screen") }
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>

                        <MapView.Animated 
                            ref={ref => {
                                this.mapViewRef = ref;
                            }}
                            style={ styles.mapView } 
                            //provider={ PROVIDER_GOOGLE }
                            initialRegion={ this.state.initialRegion }
                            region={ this.state.region }
                            loadingEnabled={ true }
                            onMapReady={ () => { console.log("onMapReady") } }
                            zoomEnabled={ true }
                            zoomControlEnabled={ true }
                            zoomTapEnabled={ true }
                            minZoomLevel={ 0 }
                            customMapStyle={ customMapStyle }
                            showsUserLocation={ true }
                            //mapType={ Platform.OS == "android" ? "none" : "standard" }
                        >
                            {((this.state.currentLocation !== null) && (this.state.devicePosition !== null)) && 
                                (
                                    <MapViewDirections
                                        origin={this.state.currentLocation.coords}
                                        destination={this.state.devicePosition}
                                        apikey={Constants.manifest.extra.googleMapsApiKey}
                                    />
                                )
                            }

                            {((this.state.devicePosition !== null)) && 
                                (
                                    <MarkerComponent
                                        ref={ref => {
                                            this.markerRef = ref;
                                        }}
                                        coordinate={ this.state.devicePosition }
                                        data={ this.state.devicePosition }
                                        markerImage={ markerImage }
                                    />
                                )
                            }

                            {((this.state.currentLocation !== null)) && 
                                (
                                    <Marker
                                        coordinate={ this.state.currentLocation.coords }
                                    />
                                )
                            }
                        </MapView.Animated>

                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }

}

const { colors } = CustomTheme;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: colors.background
    },
    
    contentContainer: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },

    mapView: {
        //...StyleSheet.absoluteFillObject,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});

const customMapStyle = [];

//Screen.propTypes = {
//    provider: ProviderPropType
//};

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing,
        //ui_devicePosition: state.device.devicePosition
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_fetchSelectedDevicePosition: () => dispatch(fetchSelectedDevicePosition())
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(SelectedDeviceDirectionScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( SelectedDeviceDirectionScreen );