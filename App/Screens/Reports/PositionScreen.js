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

import CustomTheme from '../../Themes/CustomTheme';
import AnimatedPolyLineComponent from '../../Components/AnimatedPolyLineComponent';
import ButtonComponent from '../../Components/ButtonComponent';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { fetchPositions } from '../../Store/Actions/Reports/PositionAction';
import { 
    REPORT_OBJECT_TYPE_DEVICE, 
    REPORT_OBJECT_TYPE_GROUP
} from '../../Constants/AppConstants';
const markerImage_Device = require('../../Assets/images/car_5.png');
const markerImage_Grpoup = require('../../Assets/images/icons_street_view_0.png');

moment.defaultFormat = moment.ISO_8601;

class PositionScreen extends Component {

    state = {};

    _isMounted = false;

    _animatedRegion = null;
    
    constructor( props ) {
        super( props );
        this.state = {
            ui_reportPositionIsFetching: props.ui_reportPositionIsFetching,
            object_type: props.object_type,
            initialRegion: this.getInitialRegion(),
            region: this.getInitialRegion(),
            positions: []
        };

        this.mapViewRef = React.createRef();
        this.animatedPolyLineComponentRef = React.createRef();
        this._animatedRegion = new MapView.AnimatedRegion( this.getInitialRegion() );
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true;

        //Set Object Type
        this.setState({ object_type: this.props.object_type });

        //add focus listner
        const { navigation } = this.props;
        this._focusListenerUnsubscribe = navigation.addListener("focus", () => {      
            console.log("focus");
            //get Location 
            //this.getLocationAsync()
            //.then(( location ) => {
            //    let region = {
            //        latitude: location.coords.latitude,
            //        longitude: location.coords.longitude
            //    };
            //
            //    this.setRegion( region );
            //})
            //.catch((error) => {
            //    console.log("error", error);
            //}); 

            //get Positions
            this.fetchPositions()
            .catch((error) => {
                console.log("error", error);
            });  
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

        //remove focus listner
        this._focusListenerUnsubscribe();

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
        //Set Object Type
        if (this.props.object_type !== nextProps.object_type) {
            this.setState({ object_type: nextProps.object_type });
        }

        if ( (nextProps.ui_positionList && (nextProps.ui_reportPositionIsFetching === false)) ) {
            console.log("nextProps.ui_positionList");
            let tempPositions = nextProps.ui_positionList || [];
            tempPositions = this.formatPositions( tempPositions );
            this.setPositions( tempPositions );
        }

        if (this.props.ui_reportPositionIsFetching !== nextProps.ui_reportPositionIsFetching) {
            this.setState({ ui_reportPositionIsFetching: nextProps.ui_reportPositionIsFetching });
        }
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

    fetchPositions = async () => {
        this.props.ui_fetchPositions( this.state.object_type )
        .catch((error) => {
            console.log("ui_fetchPositions", error);
        });
    }

    formatPositions = ( positions ) => {
        let tempPositions = positions.map(( v ) => {
            if ( v.deviceTime !== undefined ) { 
                let tempDateTime = moment(v.deviceTime, [ moment.defaultFormat ], true);
                if( tempDateTime.isValid() ){
                    v.deviceTime = tempDateTime.format("YYYY-MM-DD hh:mm A");
                }
            }
            if ( v.speed !== undefined ) { 
                v.speedText = (v.speed + " km/h");
            }
            return {
                ...v
            }
        });

        return tempPositions;
    }

    setRegion = ( region ) => {
        if ( this._isMounted ){
            this.setState((prevState) => {
                return {
                    ...prevState,
                    region: Object.assign({}, prevState.region, region),
                    //region: {
                        //...prevState.region,
                        //...region,
                        //latitude: region.latitude,
                        //longitude: region.longitude
                    //}
                }
            });
        }
    }

    setPositions = ( positions ) => {
        if ( this._isMounted ){
            this.setState({ positions: positions });
        }
    }

    getCamera = async () => {
        const camera = await this.mapViewRef.getCamera();
        //Alert.alert('Current camera', JSON.stringify(camera), [{ text: 'OK' }], {
        //    cancelable: true,
        //});
    }

    animatedPolyLineChangeHandler = ( coords, duration ) => {
        //this.animateToRegion(coords, duration);
        this.animateCamera(coords, duration)
        .catch((error) => {
            console.log("error", error);
        });
    }

    animateCamera = ( coords, duration = 0 ) => {
        //if( (this.mapViewRef) ){
            /*
            //console.log("this.mapViewRef", this.mapViewRef);
            //this.mapViewRef.getCamera()
            //.then(( camera ) => { 
            //    console.log("camera", camera); 
            //    camera.center.latitude = coords.latitude;
            //    camera.center.longitude = coords.longitude;
            //    this.mapViewRef.animateCamera( camera );
            //})
            //.catch(( error ) => { 
            //    console.log( error );
            //});
            */

            /*
            //const camera = await this.mapViewRef.getCamera();
            //camera.center.latitude = coords.latitude;
            //camera.center.longitude = coords.longitude;
            //this.mapViewRef.animateCamera(camera, { duration: duration });
            */

            /*
            //const lat = Number(coords.latitude)
            //const lon = Number(coords.longitude)
            //const temp_center = {
            //    latitude: lat,
            //    longitude: lon
            //};
            //this.mapViewRef.animateCamera({ center: temp_center });
            */
        //}
        const promise = new Promise((resolve, reject) => { 
            if( (this._isMounted) && (this.mapViewRef) ){
                console.log("this.mapViewRef", this.mapViewRef);
                this.mapViewRef.getCamera()
                .then(async ( camera ) => {
                    console.log("camera", camera); 
                    camera.center.latitude = coords.latitude;
                    camera.center.longitude = coords.longitude;
                    this.mapViewRef.animateCamera( camera, { duration: duration } );
                    return resolve( camera );
                })
                .catch((error) => {
                    //return reject( error );
                });
            }else{
                //return reject(new Error("Error --->"));
            }
        });

        return promise;
    }

    animateToRegion = ( coords, duration = 0 ) => {
        if( (this._isMounted) && (this.mapViewRef) ){
            console.log("this.mapViewRef", this.mapViewRef);
            let defaultCoords = Object.assign({}, this.mapViewRef.props.region, this.mapViewRef.__lastRegion);
            const lat = Number(coords.latitude)
            const lon = Number(coords.longitude)
            const temp_region = {
                ...defaultCoords,
                latitude: lat,
                longitude: lon
            };
            this.mapViewRef.animateToRegion(temp_region, duration);
        }
    }

    regionChangeHandler = ( region, isGesture ) => {
        console.log("regionChangeHandler", region, isGesture);
    }

    regionChangeCompleteHandler = ( region, isGesture ) => {
        console.log("regionChangeCompleteHandler", region, isGesture);
        //this._animatedRegion.setValue(region);
    }

    getMarkerImage = () => {
        let markerImage = null;
        switch( this.state.object_type ){
            case REPORT_OBJECT_TYPE_DEVICE:
                markerImage = markerImage_Device;
                break;
            case REPORT_OBJECT_TYPE_GROUP:
                markerImage = markerImage_Grpoup;
                break;
            default:
                markerImage = markerImage_Grpoup;
        }
        return markerImage;
    }

    setAnimatedPolyLineComponentRef = ( ref ) => {
        this.animatedPolyLineComponentRef.current = ref;
    }

    start = () => {
        console.log("this.animatedPolyLineComponentRef.current start =>", this.animatedPolyLineComponentRef.current);
        if( this.animatedPolyLineComponentRef.current ){
            this.animatedPolyLineComponentRef.current.start();
        }
    }

    stop = () => {
        console.log("this.animatedPolyLineComponentRef.current stop =>", this.animatedPolyLineComponentRef.current);
        if( this.animatedPolyLineComponentRef.current ){
            this.animatedPolyLineComponentRef.current.stop();
        }
    }

    pause = () => {
        console.log("this.animatedPolyLineComponentRef.current pause =>", this.animatedPolyLineComponentRef.current);
        if( this.animatedPolyLineComponentRef.current ){
            this.animatedPolyLineComponentRef.current.pause();
        }
    }

    render() {
        //const { colors } = this.props.theme;
        if( this.state.ui_reportPositionIsFetching ){
            return(
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        <ActivityIndicator 
                            animating={ this.state.ui_reportPositionIsFetching } 
                            color={colors.primary} 
                            size="large"
                        />
                    </View>
                </SafeAreaView>
            );
        }
        
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
                            //onRegionChange={ ( region, isGesture ) => { this.regionChangeHandler( region, isGesture ) } }
                            //onRegionChangeComplete={ ( region, isGesture ) => { this.regionChangeCompleteHandler( region, isGesture ) } }
                            zoomEnabled={ true }
                            zoomControlEnabled={ true }
                            zoomTapEnabled={ true }
                            minZoomLevel={ 0 }
                            customMapStyle={ customMapStyle }
                            //showsUserLocation={ false }
                            //mapType={ Platform.OS == "android" ? "none" : "standard" }
                        >
                            {
                                <AnimatedPolyLineComponent 
                                    ref={ref => { this.setAnimatedPolyLineComponentRef(ref) }}
                                    coordinates={ this.state.positions }
                                    strokeColor="#ff0000"
                                    strokeWidth={ 10 } 
                                    onChange={ this.animatedPolyLineChangeHandler }
                                    markerImage={ markerImage }
                                />
                            }
                            
                        </MapView.Animated>

                        {
                            <View style={ styles.bottomView }>
                                <View>
                                    <ButtonComponent onPress={() => this.start()} disabled={false} buttonViewStyle={styles.buttonComponent}>
                                        <FontAwesome name="play-circle-o" size={25} color={colors.Ebony} />
                                    </ButtonComponent>
                                </View>
                                <View>
                                    <ButtonComponent onPress={() => this.pause()} disabled={false} buttonViewStyle={styles.buttonComponent}>
                                        <FontAwesome name="pause-circle-o" size={25} color={colors.Ebony} />
                                    </ButtonComponent>
                                </View>
                                <View>
                                    <ButtonComponent onPress={() => this.stop()} disabled={false} buttonViewStyle={styles.buttonComponent}>
                                        <FontAwesome name="stop-circle-o" size={25} color={colors.Ebony} />
                                    </ButtonComponent>
                                </View>
                            </View>
                        }

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
    },

    bottomView: {
        width: '100%',
        backgroundColor: colors.transparent,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        marginBottom: 10
    },

    buttonComponent: {
        width: 50,
        height: 50,
    },

});

const customMapStyle = [];

//Screen.propTypes = {
//    provider: ProviderPropType
//};

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing,
        ui_reportPositionIsFetching: state.position.isFetching,
        ui_positionList: state.position.positionList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_fetchPositions: ( fetchType ) => dispatch(fetchPositions( fetchType ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(PositionScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( PositionScreen );