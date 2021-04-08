import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebase from '../../Config/firebase';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
// });

// getExpoPushTokenAsync
export const getExpoPushTokenAsync = () => {
    return async (dispatch, getState) => {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            //console.log("token", token);
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    };
};

// getDevicePushTokenAsync
export const getDevicePushTokenAsync = async () => {
    return async (dispatch, getState) => {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getDevicePushTokenAsync()).data;
            //console.log("token", token);
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    };
};

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
export const sendPushNotification = ( expoPushToken ) => {
    return async (dispatch, getState) => {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Original Title',
            body: 'And here is the body!',
            data: { someData: 'goes here' },
        };
    
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    };
};

// schedulePushNotification
export const schedulePushNotification = () => {
    return async (dispatch, getState) => {
        await Notifications.scheduleNotificationAsync({
            content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
            },
            trigger: { seconds: 2 },
        });
    };
};

// storeAuthUserSesssionData
export const storeNotificationData = ( data ) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            let user = getState().auth.user;
            console.log("user from State : ", user);
            if( (user) ){
                try{
                    firebase.database().ref('users/' + authUser+id + '/' + authUser.JSESSIONID).set({
                        ...data
                    }, (error) => {
                        if (error) {
                            return reject( error );
                        }else{
                            return resolve( error );
                        }
                    });
                }catch(error){
                    return reject( error );
                }
            }else{
                return reject( user );
            }
        });
        return promise;
    };
};