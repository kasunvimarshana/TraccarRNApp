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
import ListItemGroupComponent from '../Components/ListItemGroupComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { checkAuth } from '../Store/Actions/AuthAction';
import { 
    fetchGroups,
    selectGroup 
} from '../Store/Actions/GroupAction';

class GroupScreen extends Component {

    _isMounted = false;
    
    state = {};

    constructor( props ) {
        super( props );
        this.state = {
            isLoading: false,
            isFlatListRefreshing: false,
            searchText: null,
            groupList: props.ui_groupList,
            filteredGroupList: props.ui_groupList
        };

        if (
            (props.ui_groupList)
        ) {
            this.state.groupList = props.ui_groupList;
            this.state.filteredGroupList = props.ui_groupList;
        }
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;

        //let handle = InteractionManager.createInteractionHandle();
        if( this.state.groupList === null ){
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
                    await this.fetchGroups();
                    this.setState({
                        isLoading: false
                    });
                });*/
                this.fetchGroups()
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
        if ( (nextProps.ui_groupList) ) {
            console.log("nextProps.ui_groupList");
            this.setState({
                groupList: nextProps.ui_groupList,
                filteredGroupList: nextProps.ui_groupList,
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

    fetchGroups = async () => {
        this.props.ui_fetchGroups()
        .catch((error) => {
            console.log("ui_fetchGroups", error);
        });
    }

    searchFilterHandler = ( text ) => {
        const groupList = this.props.ui_groupList || [];    
        const filteredGroupList = groupList.filter(group => {      
            const groupName = String(group.name).toLowerCase();
            const textData = String(text).toLowerCase();
            return groupName.indexOf(textData) > -1;    
        });  

        if( this._isMounted ){
            this.setState({ 
                filteredGroupList: filteredGroupList,
                searchText: text 
            });
        }
    };

    onRefreshHandler = () => {
        this.fetchGroups()
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
        this.props.ui_selectGroup( item.id );
        this.props.navigation.navigate('GroupNavigationRoutes', {});
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
            <ListItemGroupComponent 
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
                        data={this.state.filteredGroupList}
                        extraData={this.state.filteredGroupList}
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
        ui_selectedGroup: state.group?.selectedGroup,
        ui_groupList: state.group?.groupList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_checkAuth: () => dispatch(checkAuth()),
        ui_fetchGroups: () => dispatch(fetchGroups()),
        ui_selectGroup: ( id ) => dispatch(selectGroup(id))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(GroupScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( GroupScreen );