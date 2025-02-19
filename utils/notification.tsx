import notifee, { EventType, AndroidImportance, TriggerType, RepeatFrequency } from '@notifee/react-native';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// 알림 채널 생성 (Android 전용)
async function createNotificationChannel() {
  return await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default', // 기본 알림음
    vibration: true, // 진동 활성화
  });
}

// Android용 알림 권한 요청 및 초기화
async function initializeAndroidNotifications() {
  const settings = await notifee.requestPermission();

  console.log('Notification permission settings:', settings);

  if (settings.authorizationStatus >= 1) {
    console.log('Notification permissions granted.');
    await createNotificationChannel(); // 채널 생성
    await requestFCMPermission(); // FCM 권한 요청
    await scheduleDailyNotification(); // 일일 알림 스케줄 설정
    onDisplayNotification('이거나 먹어라', '개쉐이들아');
  } else {
    Alert.alert('권한 거부됨', '알림 권한을 허용해주세요.');
  }
}

// 중복방지 변수
let displayedNotifications = new Set<string>();


// 포그라운드 알림 (Android 전용)
export function setupForegroundNotificationListener() {
  if (Platform.OS === 'android') { // Android에서만 실행
    messaging().onMessage(async remoteMessage => {
      const messageId = remoteMessage.messageId;

      if (!messageId || displayedNotifications.has(messageId)) {
        console.log('📌 중복된 알림이므로 무시합니다.');
        return;
      }

      console.log('📩 Foreground Notification Received:', remoteMessage);

      if (remoteMessage.notification) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title || '알림',
          body: remoteMessage.notification.body || '새로운 메시지가 도착했습니다.',
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
            sound: 'default',
            importance: AndroidImportance.HIGH,
          },
        });

        displayedNotifications.add(messageId);
        setTimeout(() => {
          displayedNotifications.delete(messageId);
        }, 30000);
      }
    });
  }
}


// FCM 알림 권한 요청
export async function requestFCMPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    await messaging()
      .getToken()
      .then(fcmToken => {
        console.log(fcmToken); // fcm token을 활용해 특정 device에 push를 보낼 수 있다.
      })
      .catch(e => console.log('error: ', e));
  }
}

export async function scheduleDailyNotification() {
  try {
    // 채널 생성 확인 (Android 전용)
    const channelId = await createNotificationChannel();

    // 현재 시간을 기준으로 다음 알림 시간 설정
    const date = new Date();
    date.setHours(17, 33, 0, 0);

    // 만약 현재 시간이 이미 지났다면 다음 날로 설정
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    // 알림 스케줄 설정 (Android 전용)
    await notifee.createTriggerNotification(
      {
        title: '일기 작성 시간입니다 ! 📝',
        body: '오늘 하루는 어떠셨나요? 소중한 추억을 기록해보세요.',
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          sound: 'default',
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        repeatFrequency: RepeatFrequency.DAILY, // 매일 반복
      }
    );

    console.log('Daily notification scheduled for:', date.toLocaleString());
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

// initializeNotifications 함수를 수정합니다
export async function initializeNotifications() {
  if (Platform.OS === 'android') {
    await initializeAndroidNotifications();
    setupForegroundNotificationListener(); // Android에서만 알림 리스너 설정
  }
}

// 즉시 알림 표시
export async function onDisplayNotification(title: string, body: string) {
  try {
    const channelId = await createNotificationChannel(); // Android 전용

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
