import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingViewComponent,
  Dimensions,
  ImageBackground
} from 'react-native';
import LoginInputScreen from '../components/LoginInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, setFcm } from '../utils/apiClient';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAvoidComponent from '../components/KeyboardAvoidComponent';


const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [user, setUser] = useState(null);

  // FCM 토큰 가져오기 함수
  async function getFCMToken() {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        return token;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // 자동 로그인 체크
  const checkAutoLogin = async () => {
    const uid = await AsyncStorage.getItem("userid");
    const upwd = await AsyncStorage.getItem("userpwd");
    try {
      if (uid != null && upwd != null) {
        const loginResult = await login(uid, upwd);
        if (!loginResult) {
          await AsyncStorage.multiRemove(['jwtToken', 'userid', 'userpwd', 'userInfo']);
          throw new Error('Login response is invalid');
        }
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          try {
            await setFcm(fcmToken);
          } catch (fcmError) {}
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {}
  };

  // 로그인 처리 함수
  const handleLogin = async (id: string, password: string) => {
    try {
      const lowerCaseId = id.toLowerCase();
      const loginResult = await login(lowerCaseId, password);
      if (!loginResult) {
        throw new Error('Login response is invalid');
      }
      const fcmToken = await getFCMToken();
      if (fcmToken) {
        try {
          await setFcm(fcmToken);
        } catch (fcmError) {}
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch (error: any) {
      Keyboard.dismiss();
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
  };

  useEffect(() => {
    checkAutoLogin();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidComponent>
        <ImageBackground
          source={require('../images/bg_pinkwave.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <Image source={require('../images/logo.png')} style={styles.logo} />
              <LoginInputScreen
                onLogin={handleLogin}
                goRegister={goRegister}
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1, // 부모 요소에 flex: 1 추가
  },
  backgroundImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 40, // 로고 아래 여백 추가
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25, // 둥근 모서리
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#FFB6C1', // 부드러운 핑크색 테두리
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#FF7D7D', // 핑크톤의 버튼
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
