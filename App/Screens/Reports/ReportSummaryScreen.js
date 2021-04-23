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
    ActivityIndicator,
    Card,
    List
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';

import CustomTheme from '../../Themes/CustomTheme';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { fetchSummary } from '../../Store/Actions/Reports/ReportSummaryAction';

moment.defaultFormat = moment.ISO_8601;

class ReportSummaryScreen extends Component {

    state = {};
    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            ui_reportReportSummaryIsFetching: props.ui_reportReportSummaryIsFetching,
            object_type: props.object_type,
            reportSummaryList: null
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true;

        //fetch Summary
        this.fetchSummary()
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
        
        if ( (nextProps.ui_reportSummaryList && (nextProps.ui_reportReportSummaryIsFetching === false)) ) {
            console.log("nextProps.ui_reportSummaryList");
            let tempReportSummary = [...nextProps.ui_reportSummaryList] || [];
            tempReportSummary = tempReportSummary.map(( v ) => {
                return this.formatSummary(v);
            });

            if ( this._isMounted ){
                this.setState({ reportSummaryList: tempReportSummary });
            }
        }

        if (this.props.ui_reportReportSummaryIsFetching !== nextProps.ui_reportReportSummaryIsFetching) {
            this.setState({ ui_reportReportSummaryIsFetching: nextProps.ui_reportReportSummaryIsFetching });
        }
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    formatSummary = ( summary ) => {
        if ( summary.distance !== undefined ) { 
            summary.distanceText = (summary.distance + " m");
        }
        if ( summary.averageSpeed !== undefined ) { 
            summary.averageSpeedText = (summary.averageSpeed + " km/h");
        }
        if ( summary.maxSpeed !== undefined ) { 
            summary.maxSpeedText = (summary.maxSpeed + " km/h");
        }
        if ( summary.spentFuel !== undefined ) { 
            summary.spentFuelText = (summary.spentFuel + " l");
        }
        return {
            ...summary
        }
    }

    fetchSummary = async () => {
        this.props.ui_fetchSummary( this.state.object_type )
        .catch((error) => {
            console.log("ui_fetchSummary", error);
        });
    }

    render() {
        //const { colors } = this.props.theme;

        if( this.state.ui_reportReportSummaryIsFetching ){
            return(
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        <ActivityIndicator 
                            animating={ this.state.ui_reportReportSummaryIsFetching } 
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
                            this.state.reportSummaryList !== null &&
                            (
                                this.state.reportSummaryList.map((reportSummary, index) => (  
                                    <Card key={index} style={styles.card}>
                                        { /*console.log("reportSummaryList => ", reportSummary, index)*/ }
                                        <Card.Content>
                                            <List.Section>
                                                {reportSummary.deviceId !== undefined && <List.Item title="Device ID" description={reportSummary.deviceId}/>}
                                                {reportSummary.deviceName !== undefined && <List.Item title="Device Name" description={reportSummary.deviceName}/>}
                                                {reportSummary.distanceText !== undefined && <List.Item title="Device Distance" description={reportSummary.distanceText}/>}
                                                {reportSummary.averageSpeedText !== undefined && <List.Item title="Avarage Speed" description={reportSummary.averageSpeedText}/>}
                                                {reportSummary.maxSpeedText !== undefined && <List.Item title="Max Speed" description={reportSummary.maxSpeedText}/>}
                                                {reportSummary.spentFuelText !== undefined && <List.Item title="Spent Fuel" description={reportSummary.spentFuelText}/>}
                                                {reportSummary.startOdometer !== undefined && <List.Item title="Start Odometer" description={reportSummary.startOdometer}/>}
                                                {reportSummary.endOdometer !== undefined && <List.Item title="End Odometer" description={reportSummary.endOdometer}/>}
                                                {reportSummary.engineHours !== undefined && <List.Item title="Engine Hours" description={reportSummary.engineHours}/>}
                                            </List.Section>
                                        </Card.Content>
                                    </Card>
                                ))
                            )
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
        alignItems: 'center',
    },

    card: {
        width: "100%",
        height: "100%"
    },

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui?.isProcessing,
        ui_reportReportSummaryIsFetching: state.reportSummary?.isFetching,
        ui_reportSummaryList: state.reportSummary?.reportSummaryList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_fetchSummary: ( fetchType ) => dispatch(fetchSummary( fetchType ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(ReportSummaryScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( ReportSummaryScreen );