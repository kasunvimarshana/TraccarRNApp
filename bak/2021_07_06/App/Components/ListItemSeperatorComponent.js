import * as React from 'react';
import { 
    StyleSheet,
    View
} from 'react-native';

import CustomTheme from '../Themes/CustomTheme';

const ListItemSeparatorComponent = () => {
    return (
        <View
            style={styles.separator}
        />
    );
};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    separator: {
        width: '100%',
        height: 0.5,
        backgroundColor: colors.TiffanyBlue
    }
});

export default ListItemSeparatorComponent;