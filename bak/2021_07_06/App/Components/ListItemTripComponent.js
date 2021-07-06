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

const ListItemTripComponent = ({item, onPressHandler}) => {

    const itemOnPressHandler = () => {
        onPressHandler();
    };

    return (
        <View>
            <TouchableOpacity onPress={ itemOnPressHandler }>

                <List.Item
                    title={ item.startTime || item.endTime }
                    description={null}
                    left={props => <AntDesign name="enviromento" size={24} color="black" />}
                />

            </TouchableOpacity>
        </View>
    );
}

export default ListItemTripComponent;