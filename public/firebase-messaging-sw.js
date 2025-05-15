/* eslint-disable */
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// const firebaseConfig = {
//   apiKey: "AIzaSyBwtETMhD6hzqbml0fJzomWQ4KNf3_4J4Y",
//   authDomain: "cxonego-dev.firebaseapp.com",
//   projectId: "cxonego-dev",
//   storageBucket: "cxonego-dev.appspot.com",
//   messagingSenderId: "397017387536",
//   appId: "1:397017387536:web:ac9c41504bf0ad5ed73095",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAojU2ajqJ1tixT2hxKU2EimUywd9dXSfw",
  authDomain: "cxonego-dev-3a322.firebaseapp.com",
  projectId: "cxonego-dev-3a322",
  storageBucket: "cxonego-dev-3a322.appspot.com",
  messagingSenderId: "324415324732",
  appId: "1:324415324732:web:ba38c1d049bf2283fbb939",
  measurementId: "G-C030TGTJNP",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.info(
  //   "[firebase-messaging-sw.js] Received background message ",
  //   payload
  // );
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.image,
  // };
  // self.registration.showNotification(notificationTitle, notificationOptions);
});