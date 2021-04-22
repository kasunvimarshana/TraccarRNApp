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
import ListItemUserComponent from '../Components/ListItemUserComponent';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';
import { checkAuth } from '../Store/Actions/AuthAction';
import { 
    fetchUsers,
    selectUser 
} from '../Store/Actions/UserAction';

class UserScreen extends Component {

    _isMounted = false;
    
    state = {};

    constructor( props ) {
        super( props );
        this.state = {
            isLoading: false,
            isFlatListRefreshing: false,
            searchText: null,
            userList: props.ui_userList,
            filteredUserList: props.ui_userList
        };

        if (
            (props.ui_userList)
        ) {
            this.state.userList = props.ui_userList;
            this.state.filteredUserList = props.ui_userList;
        }
    }

    componentDidMount() {
        // Subscribe to changes
        this._isMounted = true;
        
        //let handle = InteractionManager.createInteractionHandle();
        if( this.state.userList === null ){
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
                    await this.fetchUsers();
                    this.setState({
                        isLoading: false
                    });
                });*/
                this.fetchUsers()
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
        if ( (nextProps.ui_userList) ) {
            console.log("nextProps.ui_userList");
            this.setState({
                userList: nextProps.ui_userList,
                filteredUserList: nextProps.ui_userList,
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

    fetchUsers = async () => {
        this.props.ui_fetchUsers()
        .catch((error) => {
            console.log("ui_fetchUsers", error);
        });
    }

    searchFilterHandler = ( text ) => {
        const userList = this.props.ui_userList || [];    
        const filteredUserList = userList.filter(user => {      
            const userName = String(user.name).toLowerCase();
            const textData = String(text).toLowerCase();
            return userName.indexOf(textData) > -1;    
        });  

        if( this._isMounted ){
            this.setState({ 
                filteredUserList: filteredUserList,
                searchText: text 
            });
        }
    };

    onRefreshHandler = () => {
        this.fetchUsers()
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
        this.props.ui_selectUser( item.id );
        //this.props.navigation.navigate('Screen', {item: item});
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
            <ListItemUserComponent 
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
                        data={this.state.filteredUserList}
                        extraData={this.state.filteredUserList}
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
        ui_selectedUser: state.user.selectedUser,
        ui_userList: state.user.userList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing()),
        ui_checkAuth: () => dispatch(checkAuth()),
        ui_fetchUsers: () => dispatch(fetchUsers()),
        ui_selectUser: ( id ) => dispatch(selectUser(id))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(UserScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( UserScreen );