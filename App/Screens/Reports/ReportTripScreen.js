import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    FlatList,
    RefreshControl,
    InteractionManager,
    ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    Text,
    ActivityIndicator,
    Card,
    List,
    Modal,
    Portal,
    Button
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType, MAP_TYPES, PROVIDER_DEFAULT } from 'react-native-maps';

import CustomTheme from '../../Themes/CustomTheme';
import ListItemSeperatorComponent from '../../Components/ListItemSeperatorComponent';
import ListItemTripComponent from '../../Components/ListItemTripComponent';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { fetchTrips } from '../../Store/Actions/Reports/ReportTripAction';

moment.defaultFormat = moment.ISO_8601;

class ReportTripScreen extends Component {

    state = {};
    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            ui_reportReportTripIsFetching: props.ui_reportReportTripIsFetching,
            object_type: props.object_type,
            reportTripList: null,
            isFlatListRefreshing: false,
            isModalVisible: false,
            selectedTrip: null
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true;

        //fetch Trips
        this.fetchTrips()
        .catch((error) => {
            console.log("error", error);
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

        //Set Object Type
        if (this.props.object_type !== nextProps.object_type) {
            this.setState({ object_type: nextProps.object_type });
        }
        
        if ( (nextProps.ui_reportTripList && (nextProps.ui_reportReportTripIsFetching === false)) ) {
            console.log("nextProps.ui_reportTripList");
            let tempReportTrips = [...nextProps.ui_reportTripList] || [];
            tempReportTrips = tempReportTrips.map(( v ) => {
                return this.formatTrip(v);
            });

            if ( this._isMounted ){
                this.setState({ reportTripList: tempReportTrips });
            }
        }

        if (this.props.ui_reportReportTripIsFetching !== nextProps.ui_reportReportTripIsFetching) {
            this.setState({ ui_reportReportTripIsFetching: nextProps.ui_reportReportTripIsFetching });
        }
    }
    
    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    formatTrip = ( trip ) => {
        if ( trip.distance !== undefined ) { 
            trip.distanceText = (trip.distance + " m");
        }
        if ( trip.averageSpeed !== undefined ) { 
            trip.averageSpeedText = (trip.averageSpeed + " km/h");
        }
        if ( trip.maxSpeed !== undefined ) { 
            trip.maxSpeedText = (trip.maxSpeed + " km/h");
        }
        if ( trip.spentFuel !== undefined ) { 
            trip.spentFuelText = (trip.spentFuel + " l");
        }
        if ( trip.startTime !== undefined ) { 
            let tempDateTime = moment(trip.startTime, [ moment.defaultFormat ], true);
            if( tempDateTime.isValid() ){
                trip.startTime = tempDateTime.format("YYYY-MM-DD hh:mm A");
            }
        }
        if ( trip.endTime !== undefined ) { 
            let tempDateTime = moment(trip.endTime, [ moment.defaultFormat ], true);
            if( tempDateTime.isValid() ){
                trip.endTime = tempDateTime.format("YYYY-MM-DD hh:mm A");
            }
        }
        if ( trip.startLat !== undefined && trip.startLon !== undefined ) { 
            trip.startPosition = { latitude: trip.startLat, longitude: trip.startLon };
        }
        if ( trip.endLat !== undefined && trip.endLon !== undefined ) { 
            trip.endPosition = { latitude: trip.endLat, longitude: trip.endLon };
        }

        return {
            ...trip
        }
    }

    fetchTrips = async () => {
        this.props.ui_fetchTrips( this.state.object_type )
        .catch((error) => {
            console.log("ui_fetchTrips", error);
        });
    }

    onRefreshHandler = () => {
        this.fetchTrips()
        .then(() => {
            this.setState({
                isFlatListRefreshing: false
            });
        })
        .catch((error) => {
            this.setState({
                isFlatListRefreshing: false
            });
        });
    }

    listItemClickHandler = ( item ) => {
        this.modalShowHandler( item );
    }

    renderItem = ( props ) => {
        const { item } = props;
        return (
            <ListItemTripComponent 
                item={item} 
                onPressHandler={() => {this.listItemClickHandler(item)}}
            />
        );
    }

    modalToggleHandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isModalVisible: !prevState.isModalVisible
            }
        });
    };

    modalDismissHandler = () => {
        this.setState({
            isModalVisible: false
        });
    };

    modalShowHandler = ( trip = {} ) => {
        this.setState({
            isModalVisible: true,
            selectedTrip: trip
        });
    };

    render() {
        //const { colors } = this.props.theme;

        if( this.state.ui_reportReportTripIsFetching ){
            return(
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        <ActivityIndicator 
                            animating={ this.state.ui_reportReportTripIsFetching } 
                            color={colors.primary} 
                            size="large"
                        />
                    </View>
                </SafeAreaView>
            );
        }

        const selectedTrip = this.state.selectedTrip;

        return(
            <React.Fragment>
                { console.log("Screen") }
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        {
                            <FlatList
                                data={this.state.reportTripList}
                                extraData={this.state.reportTripList}
                                ItemSeparatorComponent={(props) => { 
                                    return (
                                        <ListItemSeperatorComponent 
                                            {...props}
                                        />
                                    ) 
                                }}
                                renderItem={(props) => { return this.renderItem(props) }}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.isFlatListRefreshing} onRefresh={this.onRefreshHandler} />
                                }
                            />
                        }

                        {
                            <Portal>
                                <Modal 
                                    visible={ this.state.isModalVisible } 
                                    onDismiss={ this.modalDismissHandler } 
                                    contentContainerStyle={ styles.modal }
                                >
                                    <Button 
                                    icon="close" 
                                    mode="contained" 
                                    onPress={() => { this.modalDismissHandler() }} 
                                    color={colors.OrangePeel}>
                                        Close
                                    </Button>
                                    <ScrollView style={styles.scrollView}>
                                        <Card style={styles.card}>
                                            <Card.Content>
                                                { 
                                                    ( selectedTrip !== null ) &&
                                                    (
                                                        <>
                                                            <List.Section>
                                                                {selectedTrip.deviceId !== undefined && <List.Item title="Device ID" description={selectedTrip.deviceId}/>}
                                                                {selectedTrip.deviceName !== undefined && <List.Item title="Device Name" description={selectedTrip.deviceName}/>}
                                                                {selectedTrip.distanceText !== undefined && <List.Item title="Distance" description={selectedTrip.distanceText}/>}
                                                                {selectedTrip.averageSpeedText !== undefined && <List.Item title="Average Speed" description={selectedTrip.averageSpeedText}/>}
                                                                {selectedTrip.maxSpeedText !== undefined && <List.Item title="Max Speed" description={selectedTrip.maxSpeedText}/>}
                                                                {selectedTrip.spentFuelText !== undefined && <List.Item title="Spent Fuel" description={selectedTrip.spentFuelText}/>}
                                                                {selectedTrip.startTime !== undefined && <List.Item title="Start Time" description={selectedTrip.startTime}/>}
                                                                {selectedTrip.endTime !== undefined && <List.Item title="End Time" description={selectedTrip.endTime}/>}
                                                                {selectedTrip.startOdometer !== undefined && <List.Item title="Start Odometer" description={selectedTrip.startOdometer}/>}
                                                                {selectedTrip.endOdometer !== undefined && <List.Item title="End Odometer" description={selectedTrip.endOdometer}/>}
                                                            </List.Section>

                                                            {
                                                                ( selectedTrip.startPosition !== undefined ) && 
                                                                (
                                                                    <MapView
                                                                        style={ styles.mapView } 
                                                                        initialRegion={{
                                                                            latitude: selectedTrip.startPosition.latitude,
                                                                            longitude: selectedTrip.startPosition.longitude,
                                                                            latitudeDelta: LATITUDE_DELTA,
                                                                            longitudeDelta: LONGITUDE_DELTA,
                                                                        }}
                                                                        loadingEnabled={ true }
                                                                        zoomEnabled={ true }
                                                                        zoomControlEnabled={ true }
                                                                        zoomTapEnabled={ true }
                                                                        minZoomLevel={ 0 }
                                                                        cacheEnabled={ true }
                                                                        showsUserLocation={ false }
                                                                        followUserLocation={ false }
                                                                    >
                                                                        {
                                                                            ( selectedTrip.startPosition !== undefined ) && 
                                                                            (
                                                                                <Marker
                                                                                    //onPress={() => { console.log("onPress"); }}
                                                                                    coordinate={{
                                                                                        latitude: selectedTrip.startPosition.latitude,
                                                                                        longitude: selectedTrip.startPosition.longitude,
                                                                                    }}
                                                                                    title="Start Position"
                                                                                />
                                                                            )
                                                                        }

                                                                        {
                                                                            ( selectedTrip.startPosition !== undefined ) && 
                                                                            (
                                                                                <Marker
                                                                                    //onPress={() => { console.log("onPress"); }}
                                                                                    coordinate={{
                                                                                        latitude: selectedTrip.endPosition.latitude,
                                                                                        longitude: selectedTrip.endPosition.longitude,
                                                                                    }}
                                                                                    title="End Position"
                                                                                />
                                                                            )
                                                                        }
                                                                    </MapView>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                            </Card.Content>
                                        </Card>
                                    </ScrollView>
                                </Modal>
                            </Portal>
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
        alignItems: 'stretch',
    },

    modal: {
        backgroundColor: colors.transparent,
        //padding: 5,
        //margin: 5,
        paddingHorizontal: 3,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollView: {
        width: "100%"
    },

    card: {
        width: "100%",
        height: "100%"
    },

    mapView: {
        width: "100%",
        height: 250
    }
});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing,
        ui_reportReportTripIsFetching: state.reportTrip.isFetching,
        ui_reportTripList: state.reportTrip.reportTripList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_fetchTrips: ( fetchType ) => dispatch(fetchTrips( fetchType ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(ReportTripScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( ReportTripScreen );