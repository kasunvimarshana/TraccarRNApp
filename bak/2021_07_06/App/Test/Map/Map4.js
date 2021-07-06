//https://www.smashingmagazine.com/2020/05/mobile-app-expo-react-native-firebase-ios-android/

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import geohash from "ngeohash";
import { firebase, firestore } from "../firebase";


let USER_ID = null;
let LOCATION_TASK = "background-location";

let updateLocation = (location) => {
  if (USER_ID) {
    firestore
      .collection("users")
      .doc(USER_ID)
      .update({
        "d.location": new firebase.firestore.GeoPoint(
          location.latitude,
          location.longitude
        ),
        g: geohash.encode(location.latitude, location.longitude, 10),
        l: new firebase.firestore.GeoPoint(
          location.latitude,
          location.longitude
        ),
      });
  }
};

TaskManager.defineTask(LOCATION_TASK, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;

    // Current position with latitude and longitude
    currentLocation = {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude,
    };
    updateLocation(currentLocation);
  }
});

export default async function watchPosition(userid) {
  // Set user ID
  USER_ID = userid;

  // Ask permissions for using GPS
  const { status } = await Location.requestPermissionsAsync();
  if (status === "granted") {
    // watch position in background
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 10,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Title",
        notificationBody: "Explanation",
        notificationColor: "#FF650D",
      },
    });
    // Watch position in foreground
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
      },
      (location) => {
        let currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        updateLocation(currentLocation);
      }
    );
  } else {
    // Location permission denied
  }
}