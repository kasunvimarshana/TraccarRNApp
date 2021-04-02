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
            <List.AccordionGroup>
                <List.Accordion title={item.name} id={item.id}>
                    {
                        item.deviceList !== null &&
                        (
                            item.deviceList.map((device, index) => (  

                                <List.Item
                                    key={index}
                                    title={device.name}
                                    description={null}
                                    left={props => <AntDesign name="car" size={24} color="black" />}
                                    onPress={() => itemOnPressHandler( device )}
                                />

                            ))
                        )
                    }
                </List.Accordion>
            </List.AccordionGroup>
        </View>
    );
}

export default ListItemGroupDeviceComponent;