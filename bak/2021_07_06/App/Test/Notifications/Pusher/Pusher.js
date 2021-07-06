// //https://code.tutsplus.com/tutorials/detaching-expo-apps-to-expokit--cms-30698

// //npm install --save pusher-js
// //npm install --save react-native-background-timer
// //npm install --save express body-parser pusher


// import BackgroundTimer from 'react-native-background-timer';
// import Pusher from 'pusher-js/react-native';
// const GOOGLE_API_KEY = 'YOUR GOOGLE PROJECT API KEY';
// const { Location, Permissions } = Expo;

// var interval_ms = 1800 * 100; // 1800 seconds = 30 minutes, times 100 to convert to milliseconds
// var location_status = null; // whether accessing the user's location is allowed or not
 
// BackgroundTimer.runBackgroundTimer(() => { // run the background task
//   if(location_status == 'granted'){ // if permission to access the location is granted by the user
//     // next: add code for getting the user's current location
//   }
// }, 
// interval_ms);

// Location.getCurrentPositionAsync({ // get the user's coordinates
//     enableHighAccuracy: true // enable fetching of high accuracy location
//   })
//   .then((res) => {
//     let { latitude, longitude } = res.coords; // extract the latitude and longitude values
//     // next: add code for getting the address based on the coordinates
//   });

//   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`)
//   .then((response) => response.json())
//   .then((responseJson) => {
//     let addr = responseJson.results[0].formatted_address;
//     // next: send the location with Pusher
//   })
//   .catch((error) => {
//     console.error(error);
//   });

//   constructor() {
//     /*
//     the code for generating unique code from earlier
//     */
//     this.pusher = null;
//   }

//   componentWillMount() {
//     this.pusher = new Pusher('YOUR PUSHER APP KEY', {
//       authEndpoint: 'YOUR AUTH SERVER ENDPOINT (TO BE ADDED LATER)',
//       cluster: 'YOUR PUSHER CLUSTER',
//       encrypted: true // whether the connection will be encrypted or not. This requires https if set to true
//     });
//   }

// //   fetch(...)
// //   .then(...)
// //   .then((responseJson) => {
// //     let addr = responseJson.results[0].formatted_address;
 
// //     current_location_channel.trigger('client-location', {
// //       addr: addr,
// //       lat: latitude,
// //       lng: longitude
// //     });
 
// //   })
// //   .catch(...);

// componentDidMount() { 
//     try {
//       Permissions.askAsync(Permissions.LOCATION).then(({ status }) => {
//         location_status = status;
//       });
//     }catch(error){
//       console.log('err: ', error);
//     }
//     // subscribe to the Pusher channel 
//     current_location_channel = this.pusher.subscribe('private-current-location-' + this.state.unique_code);
//   }

//   //server
//   {
//     "name": "ocdmom-server",
//     "version": "1.0.0",
//     "description": "",
//     "main": "server.js",
//     "scripts": {
//       "test": "echo \"Error: no test specified\" && exit 1",
//       "start": "node server.js"
//     },
//     "author": "",
//     "license": "ISC",
//     "dependencies": {
//       "body-parser": "^1.18.2",
//       "express": "^4.16.2",
//       "pusher": "^1.5.1"
//     }
//   }

//   var express = require('express');
// var bodyParser = require('body-parser');
// var Pusher = require('pusher');

// var app = express();
// app.use(bodyParser.json()); // set middleware to parse request body to JavaScript object
// app.use(bodyParser.urlencoded({ extended: false })); // for parsing URL encoded request body
// app.use(express.static('public')); // specify the directory where the static files like css, JavaScript and image files lives


// var pusher = new Pusher({ 
//     appId: process.env.APP_ID, 
//     key: process.env.APP_KEY, 
//     secret:  process.env.APP_SECRET,
//     cluster: process.env.APP_CLUSTER, 
//   });


//   app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/tracker.html');
//   });

//   app.post('/pusher/auth', function(req, res) {
//     var socketId = req.body.socket_id;
//     var channel = req.body.channel_name;
//     var auth = pusher.authenticate(socketId, channel);  
//     var app_key = req.body.app_key;
   
//     var auth = pusher.authenticate(socketId, channel);
//     res.send(auth);
//   });

//   var port = process.env.PORT || 80;
// app.listen(port);





