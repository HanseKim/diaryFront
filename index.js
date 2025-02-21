/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { RecoilRoot } from 'recoil';


// Firebase 메시징 백그라운드 핸들러 설정
messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage.notification) {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        ios: {
          sound: 'default',
          categoryId: 'default',
        }
      });
    }
  });

// Notifee 백그라운드 이벤트 처리 설정
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const eventHandlers = {
        [EventType.PRESS]: () => {
            console.log('Notification pressed in background:', detail.notification);
        },
        [EventType.ACTION_PRESS]: () => {
            console.log('Action button pressed in background:', detail.pressAction);
        },
        default: () => {
            console.log('Unknown background event type:', type);
        }
    };

    (eventHandlers[type] || eventHandlers.default)();
});

// Android 플랫폼 특정 초기화
if (Platform.OS === 'android') {
    // 추후 Android 특정 Firebase 설정이 필요할 경우 이곳에 추가
}

// 앱 등록
AppRegistry.registerComponent(appName, () => App);