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
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, ProviderPropType, AnimatedRegion, Geojson, Circle, MAP_TYPES, PROVIDER_DEFAULT } from 'react-native-maps';
import moment from 'moment';
import geojson from 'geojson';

import CustomTheme from '../../Themes/CustomTheme';
import MarkerComponent from '../../Components/MarkerComponent';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { fetchSelectedDevicePosition } from '../../Store/Actions/DeviceAction';
import { fetchGeofences } from '../../Store/Actions/GeofenceAction';
import { 
    REPORT_OBJECT_TYPE_DEVICE, 
    REPORT_OBJECT_TYPE_GROUP
} from '../../Constants/AppConstants';
import WKTHelper from '../../Helpers/WKTHelper';
const markerImage_Device = require('../../Assets/images/car_5.png');

moment.defaultFormat = moment.ISO_8601;

class SelectedDevicePositionScreen extends Component {

    state = {};
    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            initialRegion: this.getInitialRegion(),
            region: null,
            devicePosition: null,
            geofenceList: {
                geojson: {
                    type: 'FeatureCollection',
                    features: []
                },
                circles: []
            }
        };

        this.mapViewRef = React.createRef();
        this.markerRef = React.createRef();
        this._isRegionChanging = false;
        this._position = null;
        this._map_region = this.getInitialRegion();
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true;

        // updateRegion
        this.updateRegion();
        this.intervalID_updateRegion = setInterval(() => {
            this.updateRegion()
        }, 10000);

        // fetchGeofences
        this.fetchGeofences();
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
        //clearInterval
        clearInterval( this.intervalID_updateRegion );
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
            return location;
        }
        location = await Location.getCurrentPositionAsync({});
        if( this._isMounted ){
            //this.setState({ location: location });
        }
        return location;
    }

    fetchSelectedDevicePosition = async () => {
        try{
            let position = await this.props.ui_fetchSelectedDevicePosition();
            this._position = this.formatPosition(position);
            console.log("this._position", this._position);
        }catch( error ){
            console.log("error", error);
        }
        return this._position;
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

    setRegion = ( region ) => {
        if ( this._isMounted ){
            this.setState((prevState) => {
                let tempRegion = prevState.region || prevState.initialRegion;
                return {
                    ...prevState,
                    region: Object.assign({}, tempRegion, region),
                }
            });
        }
    }

    regionChangeCompleteHandler = ( region, isGesture ) => {
        console.log("regionChangeCompleteHandler", region, isGesture);
        this._isRegionChanging = false;
    }

    getMarkerImage = () => {
        let markerImage = markerImage_Device;
        return markerImage;
    }

    updateRegion = async () => {
        await this.fetchSelectedDevicePosition();
        if( (this._position) && (!this._isRegionChanging) ){
            let tempRegion = { latitude: this._position.latitude, longitude: this._position.longitude };
            if( (this._map_region) ){
                tempRegion = Object.assign({}, this._map_region, tempRegion);
            }
            this.setRegion( tempRegion );
        }
    }

    regionChangeHandler = ( region, isGesture ) => {
        console.log("regionChangeHandler", region, isGesture);
        this._map_region = region;
        this._isRegionChanging = true;
    }

    fetchGeofences = async () => {
        try{
            let geofenceList = [];
            let geofenceList_device = await this.props.ui_fetchGeofences( REPORT_OBJECT_TYPE_DEVICE );
            let geofenceList_group = await this.props.ui_fetchGeofences( REPORT_OBJECT_TYPE_GROUP );

            geofenceList = Array.prototype.concat( geofenceList_device, geofenceList_group );
            geofenceList = geofenceList.map(( geofence ) => {
                return this.formatGeofence(geofence);
            });
            if ( this._isMounted ){
                this.setState((prevState) => {
                    let tempState = prevState;
                    tempState.geofenceList.geojson.features = geofenceList.filter((geofence) => {      
                        return (geofence.geometry) && (String(geofence.geometry.type).toLowerCase() !== "circle");    
                    });
                    tempState.geofenceList.circles = geofenceList.filter((geofence) => {      
                        return (geofence.geometry) && (String(geofence.geometry.type).toLowerCase() === "circle");    
                    });
                    console.log("tempState", tempState);

                    return {
                        ...tempState
                    }
                });
            }

        }catch( error ){
            console.log("error", error);
        }
        return null;
    }

    formatGeofence = ( geofence ) => {
        let feature = {};
        if ( geofence.area !== undefined ) { 
            let area = WKTHelper.parse( geofence.area );
            if( area !== null ){
                feature = Object.assign(feature, {
                    type: "Feature",
                    properties: geofence,
                    geometry: {
                        type: area.type,
                        coordinates: area.coordinates
                    }
                });
            }
        }
        return feature;
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
                            region={ this.state.region || this.state.initialRegion }
                            loadingEnabled={ true }
                            onMapReady={ () => { console.log("onMapReady") } }
                            zoomEnabled={ true }
                            zoomControlEnabled={ true }
                            zoomTapEnabled={ true }
                            minZoomLevel={ 0 }
                            customMapStyle={ customMapStyle }
                            showsUserLocation={ true }
                            //mapType={ Platform.OS == "android" ? "none" : "standard" }
                            onRegionChange={ ( region, isGesture ) => { this.regionChangeHandler( region, isGesture ) } }
                            onRegionChangeComplete={ ( region, isGesture ) => { this.regionChangeCompleteHandler( region, isGesture ) } }
                        >

                            { 
                                this.state.geofenceList !== null &&
                                (
                                    <Geojson 
                                        geojson={this.state.geofenceList.geojson} 
                                        strokeColor={ colors.geofenceStrokeColor }
                                        fillColor={ colors.geofenceFillColor }
                                        strokeWidth={2}
                                    />
                                ) 
                            }

                            {
                                this.state.geofenceList !== null &&
                                (
                                    this.state.geofenceList.circles.map((circle, index) => {
                                        const coordinates =  circle.geometry.coordinates[0];
                                        return coordinates && (  
                                            <Circle
                                                key={index}
                                                center={{
                                                    latitude: Number(coordinates[0]), 
                                                    longitude: Number(coordinates[1])
                                                }}
                                                radius={ Number(coordinates[2]) }
                                                strokeColor={ colors.geofenceStrokeColor }
                                                fillColor={ colors.geofenceFillColor }
                                                strokeWidth={2}
                                            />
    
                                        )
                                    })
                                )
                            }

                            {this._position !== null &&
                                <MarkerComponent
                                    ref={ref => {
                                        this.markerRef = ref;
                                    }}
                                    coordinate={this.state.region}
                                    data={ this._position }
                                    markerImage={ markerImage }
                                />
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
        ui_fetchSelectedDevicePosition: () => dispatch(fetchSelectedDevicePosition()),
        ui_fetchGeofences: ( fetchType ) => dispatch(fetchGeofences( fetchType ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(SelectedDevicePositionScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( SelectedDevicePositionScreen );