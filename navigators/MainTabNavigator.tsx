import React from 'react';
import { Image, SafeAreaView, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import { PreDiaryQuestionsScreen } from '../screens/WriteDiaryScreen';
import ChatScreen from '../screens/ChatScreen';
import MyInfoScreen from '../screens/MyInfoScreen';

type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Write: undefined;
  Chat: undefined;
  MyInfo: undefined;
};

const BottomTab = createBottomTabNavigator<MainTabParamList>();

const icons = {
  Home: require('../images/Homebtn.png'),
  Search: require('../images/Search.png'),
  Write: require('../images/Diarybtn.png'),
  Chat: require('../images/Chatbtn.png'),
  MyInfo: require('../images/Mypagebtn.png'),
};

function MainTabNavigator(): React.JSX.Element {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F5BFD9',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused }) => (
          <Image source={icons[route.name]} style={styles.icon} />
        ),
      })}
    >
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Search" component={SearchScreen} />
      <BottomTab.Screen name="Write" component={PreDiaryQuestionsScreen} />
      <BottomTab.Screen name="Chat" component={ChatScreen} />
      <BottomTab.Screen name="MyInfo" component={MyInfoScreen} />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#fff',
    height: 70, // % 대신 px로 고정
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default MainTabNavigator;