import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import RegisterInputScreen from '../components/RegisterInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const apiClient = axios.create({
  //baseURL: "http://10.0.2.2:80/", // 안드로이드 에뮬레이터용
  baseURL: "http://127.0.0.1:80/", //IOS 에뮬레이터용
  headers: {
      "Content-Type": "application/json",
  },
});

const RegisterScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const handleRegister = async (nickname: string, id: string, password: string) => {
    try {
      const url = Platform.OS =='android' ? '10.0.2.2:80' : '127.0.0.1:80'
      const response = await apiClient.post('/login/register',{
        nickname:nickname, 
        id : id, 
        password : password 
      })
      if (response.status === 200) {
        console.log("Registration successful!");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const goLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

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
          <RegisterInputScreen
            handleRegister={handleRegister}
            goLogin={goLogin}
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

export default RegisterScreen;