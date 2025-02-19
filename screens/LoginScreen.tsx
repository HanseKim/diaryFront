import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import LoginInputScreen from '../components/LoginInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, setFcm } from '../utils/apiClient';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
export const apiClient = axios.create({
  //baseURL: "http://10.0.2.2:80/", // 안드로이드 에뮬레이터용
  baseURL: "http://127.0.0.1:80/", //IOS 에뮬레이터용
  headers: {
      "Content-Type": "application/json",
  },
});

const LoginScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [user, setUser] = useState(null);

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

  // 자동 로그인 체크
  const checkAutoLogin = async () => {
    console.log("자동 로그인 중");
    const uid = await AsyncStorage.getItem("userid");
    const upwd = await AsyncStorage.getItem("userpwd");
    try {
      if (uid != null && upwd != null) {
        const loginResult = await login(uid, upwd);
        console.log("Login API Result:", loginResult);

        // loginResult와 token이 있는지 확인
        // 로그인 성공 여부 체크
        if (!loginResult) {
          await AsyncStorage.multiRemove(['jwtToken', 'userid', 'userpwd', 'userInfo']);
          throw new Error('Login response is invalid');
        }
        else {
          
          const fcmToken = await getFCMToken();

          // FCM 토큰 서버 저장
          if (fcmToken) {
            setFcm(fcmToken);
          }
            
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }
      }
    }
    catch (error) {

    }
  };




  // 로그인 처리 함수
  const handleLogin = async (id: string, password: string) => {
    try {
      const loginResult = await login(id, password);
      console.log("Login API Result:", loginResult);

      // loginResult와 token이 있는지 확인
      // 로그인 성공 여부 체크
      if (!loginResult) {
        throw new Error('Login response is invalid');
      }
      else {

        const fcmToken = await getFCMToken();

        // FCM 토큰 서버 저장
        if (fcmToken) {
          await apiClient.post('/login/save-fcm-token',{
            token: fcmToken,
          })
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
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
    checkAutoLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.backgroundContainer}>
          <Image
            source={require('../images/bg_pinkwave.png')}
            style={styles.backgroundImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <Image source={require('../images/logo.png')} style={styles.logo} />
          <LoginInputScreen
            onLogin={handleLogin}
            goRegister={goRegister}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: "40%",
  }
});

export default LoginScreen;