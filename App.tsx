import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import MainTabNavigator from './navigators/MainTabNavigator';
import DiaryDetailScreen from './screens/DiaryDetail';
import SignUpScreen from './screens/SignUpScreen';
import RegisterScreen from './screens/RegisterScreen';
import { initializeNotifications } from './utils/notification'; 
import { useFCMListener } from './utils/notification'; // 🔹 Recoil 내부에서 호출하도록 변경
import { AppProvider } from './contexts/appContext';
import MessageScreen from './screens/MessageScreen';
import { WriteDiaryScreen } from './screens/WriteDiaryScreen';
import EditDiaryScreen from './screens/EditDiaryScreen';
import { setupForegroundNotificationListener } from './utils/notification';
import { RecoilRoot } from 'recoil';
import { useTokenRefresh } from './utils/tokenManager';

import { LogBox } from 'react-native'; // 경고문 제거

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Detail: undefined;
  SignUp: undefined;
  Message: undefined;
  WriteDiaryScreen: undefined;
  EditDiaryScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  useTokenRefresh(); 

  useEffect(() => {
    async function setupNotifications() {
      await initializeNotifications();
      setupForegroundNotificationListener();
    }
    LogBox.ignoreAllLogs();    
    setupNotifications();
  }, []);

  return (
    <RecoilRoot>
      <AppProvider>
        <NavigationContainer>
          {/* 🔹 여기서 Recoil 내부에서 `useFCMListener` 실행 */}
          <FCMListenerWrapper /> 

          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#fff' },
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

// 🔹 Recoil 내부에서 실행되도록 분리한 컴포넌트
const FCMListenerWrapper = () => {
  useFCMListener(); 
  return null; // UI 요소 없이 리스너만 실행
};

export default App;