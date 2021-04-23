import * as React from 'react';
import { 
    StyleSheet,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import { 
    //Colors,
    List
} from 'react-native-paper';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

import CustomTheme from '../Themes/CustomTheme';

const ListItemGroupDeviceComponent = ({item, onPressHandler}) => {

    const itemOnPressHandler = ( item ) => {
        onPressHandler( item );
    };

    return (
        <View>
            {
                <List.Section>
                    {/*<List.AccordionGroup expandedId={null}>*/}
                        <List.Item
                            title={item.name}
                            description={null}
                            left={props => <List.Icon {...props} icon="city-variant-outline"/>}
                        />
                        {
                            (item.children !== null) &&
                            (
                                item.children.map((group, index) => (  
                                    <List.Accordion 
                                        key={index}
                                        title={group.name} 
                                        id={group.id} 
                                        testID={String(group.id)}
                                        left={props => <List.Icon {...props} icon="home-variant-outline"/>}
                                        expanded={true}
                                        //onPress={() => console.log("onPress")}
                                    >
                                    {
                                        (group.deviceList !== null) &&
                                        (
                                            group.deviceList.map((device, index) => { 
                                                let iconColor = colors.deviceStatusDefault;
                                                if( String(device.status).toLowerCase() === "online" ){
                                                    iconColor = colors.deviceStatusOnline;
                                                }else if( String(device.status).toLowerCase() === "offline" ){
                                                    iconColor = colors.deviceStatusOffline;
                                                }
                
                                                return (<List.Item
                                                    key={index}
                                                    title={device.name}
                                                    description={null}
                                                    left={props => <List.Icon {...props} icon="car" color={ iconColor }/>}
                                                    onPress={() => itemOnPressHandler( device )}
                                                />);
                
                                            })
                                        )
                                    }
                                    </List.Accordion>
                                ))
                            ) 
                        }

                        {
                            (item.deviceList !== null) &&
                            (
                                item.deviceList.map((device, index) => { 
                                    let iconColor = colors.deviceStatusDefault;
                                    if( String(device.status).toLowerCase() === "online" ){
                                        iconColor = colors.deviceStatusOnline;
                                    }else if( String(device.status).toLowerCase() === "offline" ){
                                        iconColor = colors.deviceStatusOffline;
                                    }

                                    return (<List.Item
                                        key={index}
                                        title={device.name}
                                        description={null}
                                        left={props => <List.Icon {...props} icon="car" color={ iconColor }/>}
                                        onPress={() => itemOnPressHandler( device )}
                                    />);

                                })
                            )
                        }
                    {/*</List.AccordionGroup>*/}
                </List.Section>
            }
        </View>
    );
}

const { colors } = CustomTheme;

export default ListItemGroupDeviceComponent;