import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import RegisterInputScreen from '../components/RegisterInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';

const RegisterScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const handleRegister = async (nickname: string, id: string, password: string) => {
    try {
      const response = await apiClient.post("/login/register", {
        nickname, id, password 
      });
      const data = await response.data();
      if (data.success) {
        console.log("Registration successful!");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        console.error("Registration failed:", data.message);
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