// import { PushNotifications } from '@capacitor/push-notifications';
import { PushNotifications } from "@capacitor/push-notifications";

async function pushNotifications() {
  // const addListeners = async () => {
  await PushNotifications.addListener("registration", (token: any) => {
    console.info("Registration token: ", token?.value);
  });

  await PushNotifications.addListener("registrationError", (err: any) => {
    console.error("Registration error: ", err?.error);
  });

  await PushNotifications.addListener(
    "pushNotificationReceived",
    (notification: any) => {
      console.log("Push notification received: ", notification);
    }
  );

  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification: any) => {
      console.log(
        "Push notification action performed",
        notification?.actionId,
        notification?.inputValue
      );
    }
  );
  // }

  // const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    throw new Error("User denied permissions!");
  }

  await PushNotifications.register();
  // }

  // const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log("delivered notifications", notificationList);
  // }
}

export default pushNotifications;
