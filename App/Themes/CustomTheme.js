//https://coolors.co/palettes/trending
import { DefaultTheme } from 'react-native-paper';

const CustomTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        AntiqueBrass: "#CB997E",
        DesertSand: "#DDBEA9",
        ChampagnePink: "#FFE8D6",
        AshGray: "#B7B7A4",
        Artichoke: "#A5A58D",
        Ebony: "#6B705C",
        
        RichBlackFOGRA29: "#011627",
        BabyPowder: "#FDFFFC",
        TiffanyBlue: "#2EC4B6",
        RoseMadder: "#E71D36",
        OrangePeel: "#FF9F1C",
        transparent: "transparent",

        geofenceStrokeColor: "rgba(227, 53, 178, 0.85)",
        geofenceFillColor: "rgba(227, 53, 178, 0.5)",

        deviceStatusOnline: "rgba(25, 255, 25, 1)",
        deviceStatusOffline: "rgba(255, 25, 25, 1)",
        deviceStatusDefault: "rgba(25, 25, 25, 1)"
    },
};

export default CustomTheme;


/*

accent: "#03dac4"
backdrop: "rgba(0, 0, 0, 0.5)"
background: "#f6f6f6"
disabled: "rgba(0, 0, 0, 0.26)"
error: "#B00020"
notification: "#f50057"
onBackground: "#000000"
onSurface: "#000000"
placeholder: "rgba(0, 0, 0, 0.54)"
primary: "#6200ee"
surface: "#ffffff"
text: "#000000"

*/