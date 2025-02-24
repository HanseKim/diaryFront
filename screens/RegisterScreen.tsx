import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground
} from 'react-native';
import RegisterInputScreen from '../components/RegisterInputScreen';
import { apiClient } from '../utils/apiClient';
import KeyboardAvoidComponent from '../components/KeyboardAvoidComponent';

const { width, height } = Dimensions.get('window');

const RegisterScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const handleRegister = async (nickname: string, id: string, password: string) => {
    try {
      const lowerCaseId = id.toLowerCase();
      const response = await apiClient.post("/login/register", {
        nickname, id: lowerCaseId, password 
      });
      const data = await response.data;
      if (data.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        // Handle registration failure
      }
    } catch (error) {
      // Handle error
    }
  };

  const goLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <KeyboardAvoidComponent>
      <View style={styles.container}>
        <ImageBackground
          source={require('../images/bg_pinkwave.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle} // 추가 스타일
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <Image source={require('../images/logo.png')} style={styles.logo} />
              <RegisterInputScreen
                handleRegister={handleRegister}
                goLogin={goLogin}
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    </KeyboardAvoidComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center', // 내용 정렬
  },
  imageStyle: {
    resizeMode: 'cover', // 이미지를 비율에 맞게 채우기
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center', // 수직 중앙 정렬
  },
  logo: {
    width: 400,
    height: "40%",
    marginBottom: 20, // 로고와 입력 필드 간의 여백
  }
});

export default RegisterScreen;
