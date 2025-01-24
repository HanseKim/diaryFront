/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee , { EventType }from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// 백그라운드 메시지 핸들러
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('백그라운드 메시지 수신:', remoteMessage);
});

// Notifee 백그라운드 이벤트 핸들러
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('백그라운드 이벤트 발생:', { type, detail });

  switch (type) {
    case EventType.PRESS:
      console.log('백그라운드에서 알림 클릭:', detail.notification);
      break;
    case EventType.ACTION_PRESS:
      console.log('백그라운드에서 작업 버튼 클릭:', detail.pressAction);
      break;
    default:
      console.log('알 수 없는 백그라운드 이벤트 유형:', type);
      break;
  }
});

AppRegistry.registerComponent(appName, () => App);
