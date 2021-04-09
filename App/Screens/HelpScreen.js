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
import Constants from 'expo-constants';

import CustomTheme from '../Themes/CustomTheme';
import { startProcessing, stopProcessing } from '../Store/Actions/UIAction';

moment.defaultFormat = moment.ISO_8601;

class HelpScreen extends Component {

    state = {};
    _isMounted = false;
    
    constructor( props ) {
        super( props );
        this.state = {
            object_type: props.object_type
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        // Subscribe to changes
        this._isMounted = true; 
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
    }

    /*
    static getDerivedStateFromProps(props, state) {
        return { };
    }
    */

    render() {
        //const { colors } = this.props.theme;

        return(
            <React.Fragment>
                { console.log("Screen") }
                <SafeAreaView style={styles.container}>
                    <View style={styles.contentContainer}>
                        <StatusBar style="auto"/>
                        {
                            this.state.reportSummaryList !== null &&
                            (
                                <Card style={styles.card}>
                                    { <Card.Cover source={ require('../Assets/icons/ic_launcher-2/playstore.png') } style={styles.cover}/> }
                                    <Card.Content>
                                        <List.Section>
                                            { <List.Item title="Email" description="cse@globemw.net"/> }
                                            { <List.Item title="Tel" description="0995355555"/> }
                                            { <List.Item title="Version" description={ Constants.manifest.version }/> }
                                        </List.Section>
                                    </Card.Content>
                                </Card>
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

    cover: {
        resizeMode: "cover",
        width: "100%",
        height: "50%",
        padding: 5
    },

});

const mapStateToProps = (state) => {
    return {
        ui_isProcessing: state.ui.isProcessing
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ui_startProcessing: () => dispatch(startProcessing()),
        ui_stopProcessing: () => dispatch(stopProcessing())
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)( withTheme(HelpScreen) );
export default connect(mapStateToProps, mapDispatchToProps)( HelpScreen );