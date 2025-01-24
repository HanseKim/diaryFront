import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import LoginInputScreen from '../components/LoginInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../utils/apiClient';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

const LoginScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  
  // FCM 토큰 가져오기 함수
  async function getFCMToken() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        return token;
      }
    } catch (error) {
      console.error('FCM token error:', error);
    }
  }

  const handleLogin = async (id: string, password: string) => {
    try {
      const loginResult = await login(id, password);
      // FCM 토큰 가져오기
      const fcmToken = await getFCMToken();

      // 토큰을 서버에 저장
      if (fcmToken) {
        const url = 'http://10.0.2.2:80/save-fcm-token'; //안드로이드 용
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: loginResult.id,
            token: fcmToken
          }),
        });
      }

      navigation.reset({
        index: 0, 
        routes: [{ name: 'Main' }],
      });
    } catch (error: any) {
      console.error("Login failed:", error);
  
      // 에러 상태 코드와 메시지 처리
      if (error.status === 401) {
        Alert.alert("로그인 실패", "비밀번호가 일치하지 않습니다.");
      } else if (error.status === 404) {
        Alert.alert("로그인 실패", "해당 아이디의 유저가 없습니다.");
      } else {
        Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
      }
    }
  };

  const goRegister = () => {
    navigation.reset({
      index: 0, 
      routes: [{ name: 'Register' }], 
    });
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // 포그라운드 알림 처리
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
        },
      });
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../images/bg_pinkwave.png')} 
        style={styles.backgroundImage} 
      />
      <Image source={require('../images/logo.png')} style={styles.logo} />
      <LoginInputScreen 
        onLogin={handleLogin} 
        goRegister={goRegister}
        style={styles.loginInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    zIndex: 0,
  },
  logo: {
    zIndex: 1,
    width: 400,
    height: 300
  },
  loginInput: {
    zIndex: 2,
    width: 400,
    height: 470,
    alignItems: 'center',  // 가운데 정렬
    justifyContent: 'space-between'
  },
});

export default LoginScreen;