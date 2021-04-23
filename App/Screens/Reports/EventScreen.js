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
    Portal
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import moment from 'moment';

import CustomTheme from '../../Themes/CustomTheme';
import ListItemSeperatorComponent from '../../Components/ListItemSeperatorComponent';
import ListItemEventComponent from '../../Components/ListItemEventComponent';
import { startProcessing, stopProcessing } from '../../Store/Actions/UIAction';
import { fetchEvents } from '../../Store/Actions/Reports/EventAction';

moment.defaultFormat = moment.ISO_8601;

class EventScreen extends Component {

    state = {};
    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            ui_reportEventIsFetching: props.ui_reportEventIsFetching,
            object_type: props.object_type,
            reportEventList: null,
            isFlatListRefreshing: false,
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true;

        //fetch Events
        this.fetchEvents()
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
        
        if ( (nextProps.ui_reportEventList && (nextProps.ui_reportEventIsFetching === false)) ) {
            console.log("nextProps.ui_reportEventList");
            let tempEvents = [...nextProps.ui_reportEventList] || [];
            tempEvents = tempEvents.map(( v ) => {
                return this.formatEvent(v);
            });

            if ( this._isMounted ){
                this.setState({ reportEventList: tempEvents });
            }
        }

        if (this.props.ui_reportEventIsFetching !== nextProps.ui_reportEventIsFetching) {
            this.setState({ ui_reportEventIsFetching: nextProps.ui_reportEventIsFetching });
        }
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    formatEvent = ( event ) => {
        if ( event.serverTime !== undefined ) { 
            let tempDateTime = moment(event.serverTime, [ moment.defaultFormat ], true);
            if( tempDateTime.isValid() ){
                event.serverTime = tempDateTime.format("YYYY-MM-DD hh:mm A");
            }
        }
        return {
            ...event
        }
    }

    fetchEvents = async () => {
        this.props.ui_fetchEvents( this.state.object_type )
        .catch((error) => {
            console.log("ui_fetchEvents", error);
        });
    }

    onRefreshHandler = () => {
        this.fetchEvents()
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
            <ListItemEventComponent 
                item={item} 
                onPressHandler={() => {this.listItemClickHandler(item)}}
            />
        );
    }

    render() {
        //const { colors } = this.props.theme;

        if( this.state.ui_reportEventIsFetching ){
            return(
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        <ActivityIndicator 
                            animating={ this.state.ui_reportEventIsFetching } 
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
                                data={this.state.reportEventList}
                                extraData={this.state.reportEventList}
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
        ui_isProcessing: state.ui?.isProcessing,
        ui_reportEventIsFetching: state.event?.isFetching,
        ui_reportEventList: state.event?.reportEventList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_fetchEvents: ( fetchType ) => dispatch(fetchEvents( fetchType ))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(EventScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( EventScreen );