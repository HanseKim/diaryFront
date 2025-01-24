/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

const SignUpScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title='back to login' onPress={() => navigation.navigate("Login")}></Button>
    </View>
  );
};

export default SignUpScreen;