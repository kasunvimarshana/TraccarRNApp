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
import ListItemGroupDeviceComponent from '../Components/ListItemGroupDeviceComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { checkAuth } from '../Store/Actions/AuthAction';
import { 
    fetchGroups,
    selectGroup 
} from '../Store/Actions/GroupAction';
import { 
    fetchDevices,
    selectDevice 
} from '../Store/Actions/DeviceAction';
import { GetSortOrder_JSON_ASC, nest } from '../Helpers/ArrayHelper';

class GroupDeviceScreen extends Component {

    _isMounted = false;
    
    state = {};

    constructor( props ) {
        super( props );
        this.state = {
            isLoading: false,
            isFlatListRefreshing: false,
            searchText: null,
            groupDeviceList: null,
            filteredGroupDeviceList: null
        };
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;
        
        this.setState({
            isLoading: true
        });

        //let handle = InteractionManager.createInteractionHandle();
        this.interactionPromise = InteractionManager.runAfterInteractions(() => {
            this.props.ui_checkAuth()
            .catch((error) => {
                console.log("ui_checkAuth", error);
                this.props.navigation.replace("AuthRoutes");
            })
            .then(async () => {
                await this.fetchGroupDevices();
                this.setState({
                    isLoading: false
                });
            });
        });
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

        InteractionManager.clearInteractionHandle( this.interactionPromise );
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
        if (
            ((nextProps.ui_groupList) && (nextProps.ui_deviceList))
        ) {
            //console.log("nextProps.ui_groupList, nextProps.ui_deviceList", nextProps.ui_groupList, nextProps.ui_deviceList);
            const groupDevices = this.formatGroupDevices([...nextProps.ui_groupList], [...nextProps.ui_deviceList]);
            this.setState({
                groupDeviceList: groupDevices,
                filteredGroupDeviceList: groupDevices,
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

    fetchGroupDevices = async () => {
        try{
            await this.props.ui_fetchGroups();
            await this.props.ui_fetchDevices();
        }catch( error ){
            console.log("fetchGroupDevices", error);
        }
    }

    formatGroupDevices = ( groupList = [], deviceList = [] ) => {
        /*let formattedGroupDevices = [];
        const groupIdList = groupList.map(group => group.id);
        const ungroupDevices = {
            id: 0,
            name: "Ungroup Devices",
            deviceList: []
        };
        do { ungroupDevices.id = ( ungroupDevices.id + 1 ) } while ( groupIdList.includes( ungroupDevices.id ) );
        ungroupDevices.deviceList = deviceList.filter((device, index, arr) => {
            return groupIdList.includes( device.groupId ) === false
        }, []);
        const groupDevices = groupList.map(group => {
            const tempDevices = deviceList.filter((device, index, arr) => {
                return device.groupId === group.id
            }, []);
            return { ...group, deviceList: [...tempDevices] };
        });
        formattedGroupDevices = Array.prototype.concat( groupDevices, { ...ungroupDevices } );
        console.log("formattedGroupDevices", formattedGroupDevices);
        return formattedGroupDevices;*/

        let formattedGroupDevices = [];
        const groupIdList = groupList.map(group => group.id);
        const ungroupDevices = {
            id: 0,
            groupId: 0,
            name: "Ungroup Devices",
            deviceList: []
        };
        do { ungroupDevices.id = ( ungroupDevices.id + 1 ) } while ( groupIdList.includes( ungroupDevices.id ) );
        ungroupDevices.deviceList = deviceList.filter((device, index, arr) => {
            return groupIdList.includes( device.groupId ) === false
        }, []);
        const groupDevices = groupList.map(group => {
            const tempDevices = deviceList.filter((device, index, arr) => {
                return device.groupId === group.id
            }, []);
            return { ...group, deviceList: [...tempDevices] };
        });
        formattedGroupDevices = Array.prototype.concat( groupDevices, { ...ungroupDevices } );
        formattedGroupDevices.sort(GetSortOrder_JSON_ASC("id"));
        formattedGroupDevices = nest(formattedGroupDevices, 0, "groupId");
        console.log("formattedGroupDevices = ", formattedGroupDevices);
        return formattedGroupDevices;
    }

    searchFilterHandler = ( text ) => {
        const groupDeviceList = this.state.groupDeviceList || [];    
        /*const filteredGroupDeviceList = groupDeviceList.filter(group => {      
            const groupName = String(group.name).toLowerCase();
            const textData = String(text).toLowerCase();
            const devices = group.deviceList || [];
            return (( groupName.indexOf(textData ) > -1) || (
                devices.filter(device => {      
                    const deviceName = String(device.name).toLowerCase();
                    return ( deviceName.indexOf(textData ) > -1)
                }).length > 0 )
            );    
        });*/
        const filteredGroupDeviceList = groupDeviceList.filter(group => {      
            const groupName = String(group.name).toLowerCase();
            const textData = String(text).toLowerCase();
            return ( ( groupName.indexOf(textData ) > -1) );    
        });

        if( this._isMounted ){
            this.setState({ 
                filteredGroupDeviceList: filteredGroupDeviceList,
                searchText: text 
            });
        }
    };

    onRefreshHandler = () => {
        this.fetchGroupDevices()
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
        this.props.ui_selectGroup( item.groupId );
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
            <ListItemGroupDeviceComponent 
                item={item} 
                onPressHandler={(device) => { this.listItemClickHandler(device) }}
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
                        data={this.state.filteredGroupDeviceList}
                        extraData={this.state.filteredGroupDeviceList}
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
        ui_isProcessing: state.ui.isProcessing,
        ui_selectedGroup: state.group.selectedGroup,
        ui_groupList: state.group.groupList,
        ui_selectedDevice: state.device.selectedDevice,
        ui_deviceList: state.device.deviceList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_checkAuth: () => dispatch(checkAuth()),
        ui_fetchGroups: () => dispatch(fetchGroups()),
        ui_selectGroup: ( id ) => dispatch(selectGroup(id)),
        ui_fetchDevices: () => dispatch(fetchDevices()),
        ui_selectDevice: ( id ) => dispatch(selectDevice(id))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(GroupDeviceScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( GroupDeviceScreen );