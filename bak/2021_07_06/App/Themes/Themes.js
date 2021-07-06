//https://coolors.co/palettes/trending
import { DefaultTheme } from 'react-native-paper';

const Theme_1 = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: "#8d60e1",
        accent: "#F4487D",
        accentDark: "#bc0051",
        background: "#ededed",
        surface: "#fff",
        font: "light"
    }
};

//https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c
const Theme_2 = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        RichBlackFOGRA29: "#011627",
        BabyPowder: "#FDFFFC",
        TiffanyBlue: "#2EC4B6",
        RoseMadder: "#E71D36",
        OrangePeel: "#FF9F1C"
    }
};

//https://coolors.co/3e5641-a24936-d36135-282b28-83bca9
const Theme_3 = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        HunterGreen: "#3E5641",
        Chestnut: "#A24936",
        Flame: "#D36135",
        CharlestonGreen: "#282B28",
        GreenSheen: "#83BCA9"
    }
};

export default { Theme_1, Theme_2, Theme_3 };