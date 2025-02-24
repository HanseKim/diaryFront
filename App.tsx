import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './navigators/MainTabNavigator';
import { initializeNotifications } from './utils/notification';
import { useFCMListener } from './utils/notification';
import { AppProvider } from './contexts/appContext';
import { setupForegroundNotificationListener } from './utils/notification';
import { RecoilRoot } from 'recoil';
import { useTokenRefresh } from './utils/tokenManager';
import { LogBox } from 'react-native';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  SignUp: undefined;
  Main: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

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
          <FCMListenerWrapper />
          <AuthStack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#fff' },
            }}
          >
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="Main" component={MainTabNavigator} />
          </AuthStack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </RecoilRoot>
  );
}

const FCMListenerWrapper = () => {
  useFCMListener();
  return null;
};

export default App;