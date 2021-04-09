import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from '_screens/Home';
import Splash from '_screens/Splash';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import React, { useState, useEffect } from 'react';

/* expo-splash-screen works fine but raise an exception because the managed expo workflow
 * use the old version of this library, however a fix was merged and probably in the next version of
 * expo this will be fixed, about this error https://github.com/expo/expo/issues/8067
 */
preventAutoHideAsync().catch(console.warn);

export type RootStackParamList = {
  Home: undefined;
};

export default function App(): JSX.Element {
  const [isLoadingSplash, setIsLoadingSplash] = useState(true);
  const Drawer = createDrawerNavigator();
  const init = (): void => {
    setTimeout(async () => {
      hideAsync().catch(console.warn);
      setIsLoadingSplash(false);
    }, 5000);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {isLoadingSplash && <Splash />}
      {!isLoadingSplash && (
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Login" component={Login} />
            <Drawer.Screen name="Home" component={Home} />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}