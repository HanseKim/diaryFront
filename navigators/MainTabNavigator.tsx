/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  Image,
  SafeAreaView,
  Text,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import {PreDiaryQuestionsScreen }from '../screens/WriteDiaryScreen';
import ChatScreen from '../screens/ChatScreen';
import MyInfoScreen from '../screens/MyInfoScreen';

type mainTabParamList = {
    Home : undefined,
    Search : undefined,
    Write : undefined,
    Chat : undefined,
    MyInfo : undefined
  };

const BottomTab = createBottomTabNavigator<mainTabParamList>();

function MainTabNavigator(): React.JSX.Element {

  return (
      <BottomTab.Navigator
        screenOptions={{
          headerShown: false, 
          tabBarActiveTintColor: "#F5BFD9", // 활성화 상태의 텍스트 및 아이콘 색상
          tabBarInactiveTintColor: "#999", // 비활성화 상태의 텍스트 및 아이콘 색상
          tabBarStyle: { backgroundColor: "#fff", height: "8%" }, // 탭 바 배경색, 높이
      }}>
        <BottomTab.Screen 
          name="Home"
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/Homebtn.png") // 선택된 이미지
                    : require("../images/Homebtn.png") // 비선택 이미지
                }
                style={{ width: 24, height: 24 }} // 색상 적용
              />
            ),}}></BottomTab.Screen>
        <BottomTab.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/Search.png") // 선택된 이미지
                    : require("../images/Search.png") // 비선택 이미지
                }
                style={{ width: 24, height: 24 }}
              />
            ),}}></BottomTab.Screen>
        <BottomTab.Screen 
          name="Write" 
          component={PreDiaryQuestionsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/Diarybtn.png") // 선택된 이미지
                    : require("../images/Diarybtn.png") // 비선택 이미지
                }
                style={{ width: 24, height: 24 }}
              />
            ),}}></BottomTab.Screen>
        <BottomTab.Screen 
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/Chatbtn.png") // 선택된 이미지
                    : require("../images/Chatbtn.png") // 비선택 이미지
                }
                style={{ width: 24, height: 24 }}
              />
            ),}}></BottomTab.Screen>
        <BottomTab.Screen 
          name="MyInfo" 
          component={MyInfoScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require("../images/Mypagebtn.png") // 선택된 이미지
                    : require("../images/Mypagebtn.png") // 비선택 이미지
                }
                style={{ width: 24, height: 24 }}
              />
            ),}}></BottomTab.Screen>
      </BottomTab.Navigator>
  );
}

export default MainTabNavigator;
