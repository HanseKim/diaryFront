import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// 알림 채널 생성
async function createNotificationChannel() {
  return await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default', // 기본 알림음
    vibration: true, // 진동 활성화
  });
}

// 알림 권한 요청
export async function requestNotificationPermission() {
  const settings = await notifee.requestPermission();

  console.log('Notification permission settings:', settings);

  if (settings.authorizationStatus >= 1) {
    console.log('Notification permissions granted.');
    await createNotificationChannel(); // 채널 생성
  } else {
    Alert.alert('권한 거부됨', '알림 권한을 허용해주세요.');
  }
}

let displayedNotifications = new Set<string>();

export function setupNotificationListeners() {
  const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.DELIVERED && detail.notification) {
      const { id, title, body } = detail.notification;

      // 이미 표시된 알림인지 확인
      if (id && displayedNotifications.has(id)) {
        console.log(`Notification with ID ${id} already displayed.`);
        return;
      }

      // 알림 표시
      if (title || body) {
        await notifee.displayNotification({
          title: title || '',
          body: body || '',
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
          },
        });
        if (id) {
          displayedNotifications.add(id); // 표시된 알림 ID 저장
        }
      }
    }
  });

  return unsubscribe;
}

// FCM 알림 권한 요청
export async function requestFCMPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('FCM 알림 권한 승인됨.');
  } else {
    console.log('FCM 알림 권한 거부됨.');
  }
}

// 알림 초기화
export async function initializeNotifications() {
  await requestNotificationPermission(); // Notifee 권한 요청
  await requestFCMPermission(); // FCM 권한 요청
  setupNotificationListeners(); // 리스너 등록
}

/*

// 즉시 알림 표시
export async function onDisplayNotification(title: string, body: string) {
  try {
    const channelId = await createNotificationChannel();

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Android용 아이콘 (앱의 리소스 폴더에서 제공해야 함)
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [300, 500], // 진동 패턴
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
}
*/