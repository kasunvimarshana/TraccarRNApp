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
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
                let token;
                if (Constants.isDevice) {
                    const { status: existingStatus } = await Notifications.getPermissionsAsync();
                    let finalStatus = existingStatus;
                    if (existingStatus !== "granted") {
                        const { status } = await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    }
                    if (finalStatus !== "granted") {
                        console.log("Failed to get push token for push notification!");
                        throw new Error("Failed to get push token for push notification!");
                    }
                    token = (await Notifications.getExpoPushTokenAsync()).data;
                } else {
                    console.log("Must use physical device for Push Notifications");
                    throw new Error("Must use physical device for Push Notifications");
                }

                if (Platform.OS === "android") {
                    Notifications.setNotificationChannelAsync("default", {
                        name: "default",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#FF231F7C",
                    });
                }
                console.log("token", token);
                return resolve(token);
            }catch( error ){
                return reject( error );
            }
        });

        return promise;
    };
};

// getDevicePushTokenAsync
export const getDevicePushTokenAsync = () => {
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
                let token;
                if (Constants.isDevice) {
                    const { status: existingStatus } = await Notifications.getPermissionsAsync();
                    let finalStatus = existingStatus;
                    if (existingStatus !== "granted") {
                        const { status } = await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    }
                    if (finalStatus !== "granted") {
                        console.log("Failed to get push token for push notification!");
                        throw new Error("Failed to get push token for push notification!");
                    }
                    token = (await Notifications.getDevicePushTokenAsync()).data;
                } else {
                    console.log("Must use physical device for Push Notifications");
                    throw new Error("Must use physical device for Push Notifications");
                }

                if (Platform.OS === "android") {
                    Notifications.setNotificationChannelAsync("default", {
                        name: "default",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#FF231F7C",
                    });
                }
                console.log("token", token);
                return resolve(token);
            }catch( error ){
                return reject( error );
            }
        });

        return promise;
    };
};

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
export const sendPushNotification = ( expoPushToken ) => {
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
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
                return resolve( null );
            }catch( error ){
                reject( error );
            }
        });

        return promise; 
    };
};

// schedulePushNotification
export const schedulePushNotification = () => {
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
                await Notifications.scheduleNotificationAsync({
                    content: {
                    title: "You've got mail! 📬",
                    body: 'Here is the notification body',
                    data: { data: 'goes here' },
                    },
                    trigger: { seconds: 2 },
                });
                return resolve( null );
            }catch( error ){
                reject( error );
            }
        });

        return promise;
    };
};

// storeAuthUserSesssionData
export const storeNotificationData = ( data ) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            let user = getState().auth.user;
            if( (user) ){
                try{
                    firebase.database().ref('users/' + user.id).set({
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