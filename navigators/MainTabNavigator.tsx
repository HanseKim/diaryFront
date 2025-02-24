import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import { PreDiaryQuestionsScreen } from '../screens/WriteDiaryScreen';
import ChatScreen from '../screens/ChatScreen';
import MyInfoScreen from '../screens/MyInfoScreen';
import DiaryDetailScreen from '../screens/DiaryDetail';
import MessageScreen from '../screens/MessageScreen';
import { WriteDiaryScreen } from '../screens/WriteDiaryScreen';
import EditDiaryScreen from '../screens/EditDiaryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 각 탭에 대한 스택 네비게이터
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Detail" component={DiaryDetailScreen} />
    <Stack.Screen name="EditDiaryScreen" component={EditDiaryScreen} />
  </Stack.Navigator>
);

const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
    <Stack.Screen name="Message" component={MessageScreen} />
  </Stack.Navigator>
);

const WriteStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PreDiaryQuestions" component={PreDiaryQuestionsScreen} />
    <Stack.Screen name="WriteDiaryScreen" component={WriteDiaryScreen} />
  </Stack.Navigator>
);

// const icons = {
//   Home: require('../images/Homebtn.png'),
//   Search: require('../images/Search.png'),
//   Write: require('../images/Diarybtn.png'),
//   Chat: require('../images/Chatbtn.png'),
//   MyInfo: require('../images/Mypagebtn.png'),
// };

const icons: { [key: string]: any } = {
  Home: require('../images/Homebtn.png'),
  Search: require('../images/Search.png'),
  Write: require('../images/Diarybtn.png'),
  Chat: require('../images/Chatbtn.png'),
  MyInfo: require('../images/Mypagebtn.png'),
};

function MainTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F5BFD9',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused }) => (
          <Image
            source={icons[route.name]}
            style={styles.icon}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Write" component={WriteStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="MyInfo" component={MyInfoScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#fff',
    height: 80, // % 대신 px로 고정
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default MainTabNavigator;