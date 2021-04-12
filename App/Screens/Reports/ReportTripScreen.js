import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    FlatList,
    RefreshControl,
    InteractionManager
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    Text,
    ActivityIndicator,
    Card,
    List
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';

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

    listItemClickHandler = ( item ) => { }

    renderItem = ( props ) => {
        const { item } = props;
        return (
            <ListItemTripComponent 
                item={item} 
                onPressHandler={() => {this.listItemClickHandler(item)}}
            />
        );
    }

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
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }

}

const { colors } = CustomTheme;



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