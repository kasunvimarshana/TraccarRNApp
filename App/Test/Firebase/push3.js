//https://farazpatankar.com/push-notifications-in-react-native/
//https://www.codementor.io/@uokesita/react-native-push-notifications-with-firebase-2019-10on0z19t6

import { Alert, Platform } from 'react-native'
import * as Permissions from 'expo-permissions';
import { Linking } from 'expo';

const hasNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    // If we don't already have permission, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus === 'granted') return true;
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Warning',
        'You will not receive reminders if you do not enable push notifications. If you would like to receive reminders, please enable push notifications for Fin in your settings.',
        [
          { text: 'Cancel' },
          // If they said no initially and want to change their mind,
          // we can automatically open our app in their settings
          // so there's less friction in turning notifications on
          { text: 'Enable Notifications', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      )
      return false;
    }
  } catch (error) {
    Alert.alert(
      'Error',
      'Something went wrong while check your notification permissions, please try again later.'
    );
    return false;
  }
}