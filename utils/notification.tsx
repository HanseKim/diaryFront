import notifee, { EventType, AndroidImportance, TriggerType, RepeatFrequency } from '@notifee/react-native';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { refreshTriggerState } from '../store/recoilstate';
import { useEffect } from 'react';

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



  if (settings.authorizationStatus >= 1) {

    await createNotificationChannel(); // 채널 생성
  } else {
    Alert.alert('권한 거부됨', '알림 권한을 허용해주세요.');
  }
}

//중복방지 변수
let displayedNotifications = new Set<string>();

export const useFCMListener = () => {
  const [refreshTrigger, setRefreshTrigger] = useRecoilState(refreshTriggerState);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const messageId = remoteMessage.messageId;

      if (!messageId || displayedNotifications.has(messageId)) {

        return;
      }



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
          ios: {  // iOS 설정 추가
            sound: 'default',
            categoryId: 'default',
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
          }
        });

        setRefreshTrigger((prev) => prev + 1); // 상태 업데이트

        // 표시된 알림 ID 저장 (중복 방지)
        displayedNotifications.add(messageId);
        setTimeout(() => displayedNotifications.delete(messageId), 30000);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [refreshTrigger, setRefreshTrigger]);

  return null;
};

//포그라운드 알림
export function setupForegroundNotificationListener() {
  messaging().onMessage(async remoteMessage => {
    const messageId = remoteMessage.messageId;

    // messageId가 없거나 이미 표시된 알림이면 무시
    if (!messageId || displayedNotifications.has(messageId)) {

      return;
    }





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
        ios: {  // iOS 설정 추가
          sound: 'default',
          categoryId: 'default',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        }
      });
      const setRefreshTrigger = useSetRecoilState(refreshTriggerState);
      setRefreshTrigger((prev) => prev + 1);

      const refreshTrigger = useRecoilValue(refreshTriggerState);
      Alert.alert(String(refreshTrigger));

      // 표시된 알림 ID 저장 (중복 방지)
      displayedNotifications.add(messageId);

      // 30초 후 삭제하여 다시 받을 수 있도록 함
      setTimeout(() => {
        displayedNotifications.delete(messageId);
      }, 30000);
    }
  });
}


// FCM 알림 권한 요청
export async function requestFCMPermission() {
  try {
    await messaging().setAutoInitEnabled(true);
    
    const authStatus = await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      provisional: false,
      sound: true,
    });
    
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();

      return token; // 토큰을 서버에 보내기 위해 반환
    }
    
    return null;
  } catch (error) {

    return null;
  }
}
/*
export async function scheduleDailyNotification() {
  try {
    // 채널 생성 확인
    const channelId = await createNotificationChannel();
    
    // 현재 시간을 기준으로 다음 알림 시간 설정 (오후 10시 52분)
    const date = new Date();
    date.setHours(17, 33, 0, 0);

    // 만약 현재 시간이 이미 지났다면 다음 날로 설정
    if (date.getTime() < Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    // 알림 스케줄 설정
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
        repeatFrequency: RepeatFrequency.DAILY  // 매일 반복
      }
    );


  } catch (error) {

  }
}*/

// initializeNotifications 함수를 수정합니다
export async function initializeNotifications() {
  await requestNotificationPermission();
  await requestFCMPermission();
  
  // 알림 확인 용
  // onDisplayNotification();

  // 일일 알림 스케줄 설정
  //await scheduleDailyNotification();
}

// 즉시 알림 표시
export async function onDisplayNotification() {
  try {
    const channelId = await createNotificationChannel();

    await notifee.displayNotification({
      title : '안녕',
      body : "친구들 빡빡이 아져씨야",
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Android용 아이콘 (앱의 리소스 폴더에서 제공해야 함)
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [300, 500], // 진동 패턴
      },
      ios: {  // iOS 설정 추가
        sound: 'default',
        categoryId: 'default',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      }
    });
  } catch (error) {

  }
}