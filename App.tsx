import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import MainTabNavigator from './navigators/MainTabNavigator';
import DiaryDetailScreen from './screens/DiaryDetail';
import SignUpScreen from './screens/SignUpScreen';
import RegisterScreen from './screens/RegisterScreen';
import { initializeNotifications } from './utils/notification';
import { AppProvider } from './contexts/appContext'
import MessageScreen from './screens/MessageScreen';
import {WriteDiaryScreen} from './screens/WriteDiaryScreen';
import EditDiaryScreen from './screens/EditDiaryScreen';
import { setupForegroundNotificationListener } from './utils/notification';
import { RecoilRoot } from 'recoil'; // RecoilRoot import 추가


type RootStackParamList = {
  Login: undefined,
  Register: undefined,
  Main: undefined,
  Detail: undefined,
  SignUp: undefined,
  Message : undefined,
  WriteDiaryScreen : undefined
  EditDiaryScreen : undefined
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    initializeNotifications();
    setupForegroundNotificationListener();
  }, []);

  return (
    <RecoilRoot>
      <AppProvider>
        <NavigationContainer>
        <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,  // 헤더 숨기기 추가
              cardStyle: { backgroundColor: '#fff' }
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerTitle: '' }} />
            <Stack.Screen name="Detail" component={DiaryDetailScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
            <Stack.Screen name="WriteDiaryScreen" component={WriteDiaryScreen} />
            <Stack.Screen name="EditDiaryScreen" component={EditDiaryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </RecoilRoot>
    
  );
}

export default App;