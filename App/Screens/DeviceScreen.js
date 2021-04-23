import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    Dimensions,
    TextInput,
    FlatList,
    RefreshControl,
    InteractionManager
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
    //Colors,
    ActivityIndicator
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';

import CustomTheme from '../Themes/CustomTheme';
import FlatListHeaderComponent from '../Components/FlatListHeaderComponent';
import ListItemSeperatorComponent from '../Components/ListItemSeperatorComponent';
import ListItemDeviceComponent from '../Components/ListItemDeviceComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { checkAuth } from '../Store/Actions/AuthAction';
import { 
    fetchDevices,
    selectDevice 
} from '../Store/Actions/DeviceAction';

class DeviceScreen extends Component {

    _isMounted = false;
    
    state = {};

    constructor( props ) {
        super( props );
        this.state = {
            isLoading: false,
            isFlatListRefreshing: false,
            searchText: null,
            deviceList: props.ui_deviceList,
            filteredDeviceList: props.ui_deviceList
        };

        if (
            (props.ui_deviceList)
        ) {
            this.state.deviceList = props.ui_deviceList;
            this.state.filteredDeviceList = props.ui_deviceList;
        }
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;
        
        //let handle = InteractionManager.createInteractionHandle();
        if( this.state.deviceList === null ){
            this.setState({
                isLoading: true
            });
            
            this.interactionPromise = InteractionManager.runAfterInteractions(() => {
                /*this.props.ui_checkAuth()
                .catch((error) => {
                    console.log("ui_checkAuth", error);
                    this.props.navigation.replace("AuthRoutes");
                })
                .then(async () => {
                    await this.fetchDevices();
                    this.setState({
                        isLoading: false
                    });
                });*/
                this.fetchDevices()
                .then(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            });
        }
    }

    componentDidUpdate(prevProps) {
        // Listen Props Change
        if (prevProps.isFocused !== this.props.isFocused) {
            // Use the `this.props.isFocused` boolean
            // Call any action
        }
    }

    componentWillUnmount() {
        // Clean up listener
        this._isMounted = false;

        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };

        if( this.interactionPromise !== undefined ){
            InteractionManager.clearInteractionHandle( this.interactionPromise );
        }
    }

    componentDidCatch(error, info) { 
        // logToExternalService may make an API call. 
        console.log(info.componentStack);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Any time props changes, update state.
        if ( (nextProps.ui_deviceList) ) {
            console.log("nextProps.ui_deviceList");
            this.setState({
                deviceList: nextProps.ui_deviceList,
                filteredDeviceList: nextProps.ui_deviceList,
                searchText: null
            });
        }
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return {
            ...state
        };
    }
    */

    fetchDevices = async () => {
        this.props.ui_fetchDevices()
        .catch((error) => {
            console.log("ui_fetchDevices", error);
        });
    }

    searchFilterHandler = ( text ) => {
        const deviceList = this.props.ui_deviceList || [];    
        const filteredDeviceList = deviceList.filter(device => {      
            const deviceName = String(device.name).toLowerCase();
            const textData = String(text).toLowerCase();
            return deviceName.indexOf(textData) > -1;    
        });  

        if( this._isMounted ){
            this.setState({ 
                filteredDeviceList: filteredDeviceList,
                searchText: text 
            });
        }
    };

    onRefreshHandler = () => {
        this.fetchDevices()
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
        this.props.ui_selectDevice( item.id );
        this.props.navigation.navigate('DeviceNavigationRoutes', {});
    }

    renderListHeaderComponent = () => {
        const { searchText } = this.state;
        return (
            <FlatListHeaderComponent 
                onChangeText={(text) => this.searchFilterHandler(text)}
                defaultValue={searchText}
                value={searchText} 
            />
        );
    }

    renderItem = ( props ) => {
        const { item } = props;
        return (
            <ListItemDeviceComponent 
                item={item} 
                onPressHandler={() => {this.listItemClickHandler(item)}}
            />
        );
    }

    render() {
        //const { colors } = this.props.theme;
        if ( this.state.isLoading ) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        <ActivityIndicator 
                            animating={this.state.isLoading} 
                            color={colors.primary} 
                            size="large"
                            style={styles.activityIndicator}
                        />
                    </View>
                </SafeAreaView>
            );
        }

        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <StatusBar style="auto"/>
                    <FlatList
                        data={this.state.filteredDeviceList}
                        extraData={this.state.filteredDeviceList}
                        ItemSeparatorComponent={(props) => { 
                            return (
                                <ListItemSeperatorComponent 
                                    {...props}
                                />
                            ) 
                        }}
                        ListHeaderComponent={this.renderListHeaderComponent}
                        renderItem={(props) => { return this.renderItem(props) }}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl refreshing={this.state.isFlatListRefreshing} onRefresh={this.onRefreshHandler} />
                        }
                    />
                </View>
            </SafeAreaView>
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
    }

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui?.isProcessing,
        ui_selectedDevice: state.device?.selectedDevice,
        ui_deviceList: state.device?.deviceList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_checkAuth: () => dispatch(checkAuth()),
        ui_fetchDevices: () => dispatch(fetchDevices()),
        ui_selectDevice: ( id ) => dispatch(selectDevice(id))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(DeviceScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( DeviceScreen );