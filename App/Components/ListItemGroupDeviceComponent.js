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

const ListItemGroupDeviceComponent = ({item, onPressHandler}) => {

    const itemOnPressHandler = ( item ) => {
        onPressHandler( item );
    };

    return (
        <View>
            {
                <List.Section>
                    <List.Accordion 
                        title={item.name} 
                        id={item.id}
                        left={props => <List.Icon {...props} icon="city-variant-outline"/>}
                    >
                    {
                        (item.children !== null) &&
                        (
                            item.children.map((group, index) => (  
                                <List.AccordionGroup key={index}>
                                    <List.Accordion 
                                        title={group.name} 
                                        id={group.id} 
                                        left={props => <List.Icon {...props} icon="home-variant-outline"/>}
                                    >
                                    {
                                        (group.deviceList !== null) &&
                                        (
                                            group.deviceList.map((device, index) => (  
        
                                                <List.Item
                                                    key={index}
                                                    title={device.name}
                                                    description={null}
                                                    left={props => <List.Icon {...props} icon="car" />}
                                                    onPress={() => itemOnPressHandler( device )}
                                                />
        
                                            ))
                                        )
                                    }
                                    </List.Accordion>
                                </List.AccordionGroup>
                            ))
                        ) 
                    }

                    {
                        (item.deviceList !== null) &&
                        (
                            item.deviceList.map((device, index) => (  

                                <List.Item
                                    key={index}
                                    title={device.name}
                                    description={null}
                                    left={props => <List.Icon {...props} icon="car" />}
                                    onPress={() => itemOnPressHandler( device )}
                                />

                            ))
                        )
                    }
                    </List.Accordion>
                </List.Section>
            }
        </View>
    );
}

export default ListItemGroupDeviceComponent;