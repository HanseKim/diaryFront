import React,{useState} from 'react';
import {
  View,
  Image,
  StyleSheet
} from 'react-native';
import RegisterInputScreen from '../components/RegisterInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const handleRegister = async (nickname: string, id: string, password: string) => {
    try {
      const response = await fetch("http://10.0.2.2:80/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname, id, password }),
      });

      const data = await response.json();
      
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
    <View style={[styles.container]}>
        <Image 
            source={require('../images/bg_pinkwave.png')} 
            style={styles.backgroundImage} 
        />
        <Image source={require('../images/logo.png')} style={styles.logo} />
        <RegisterInputScreen 
            handleRegister={handleRegister} 
            goLogin={goLogin}
            style={styles.loginInput}/>
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

export default RegisterScreen;
