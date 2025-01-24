import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import MainTabNavigator from './navigators/MainTabNavigator';
import DiaryDetailScreen from './screens/DiaryDetail';
import SignUpScreen from './screens/SignUpScreen';
import RegisterScreen from './screens/RegisterScreen';
import { initializeNotifications, setupNotificationListeners } from './utils/notification';
import { AppProvider } from './contexts/appContext'
import MessageScreen from './screens/MessageScreen';
import {WriteDiaryScreen} from './screens/WriteDiaryScreen';

type RootStackParamList = {
  Login: undefined,
  Register: undefined,
  Main: undefined,
  Detail: undefined,
  SignUp: undefined,
  Message : undefined,
  WriteDiaryScreen : undefined
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Detail" component={DiaryDetailScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="WriteDiaryScreen" component={WriteDiaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;