/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import UserInfoComponent from '../components/UserInfoComponent';
import CoupleInfoComponent from '../components/CoupleInfoComponent';
import UserModal from '../components/UserModal';
import CoupleModal from '../components/CoupleModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';
import * as Animatable from 'react-native-animatable';

const MyInfoScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [modal, setModal] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보 상태 추가
  const [animateUser, setAnimateUser] = useState(false); // 애니메이션 트리거

  const handleModal = (modal_num: number) => setModal(modal_num);

  // AsyncStorage에서 사용자 정보 가져오기
  const getUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error("Error retrieving user info:", error);
    }
  };

  const calculateDaysPassed = (): number => {
    if (!userInfo || !userInfo.date) return -1; // userInfo가 없거나 date가 없으면 -1 반환
    const startDate = new Date(userInfo.date); // userInfo.date 사용
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일로 변환
  };

  const [daysPassed, setDaysPassed] = useState<number>(calculateDaysPassed()+1);
  const [coupleName, setCoupleName] = useState<string>("");
  const [couple_month, setCoupleMonth] = useState<number>(0);
  const [couple_all, setCoupleAll] = useState<number>(0);

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    const days = calculateDaysPassed();
    setDaysPassed(days+1);
    
    if(userInfo && userInfo.coupleName) {
      setCoupleName(userInfo.coupleName)
    }
    if(userInfo && userInfo.couple_month && userInfo.couple_all) {
      setCoupleMonth(userInfo.couple_month)
      setCoupleAll(userInfo.couple_all)
    }
  }, [userInfo]); // userInfo가 변경될 때마다 실행

  // 사용자 정보를 업데이트하고 데이터베이스에 저장
  const updateUserInfo = async (newDate: string, options: any) => {
    const updatedUserInfo = { 
      ...userInfo, 
      date: newDate, 
      options: options, 
    }; 
    setUserInfo(updatedUserInfo);

    try {
      await apiClient.post("/userprofile", {
        id: updatedUserInfo.id, 
        date: newDate,
        options: options,
      });
      await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserInfo)); // AsyncStorage에 저장
    } catch (error) {
      console.error("Error updating user info in database:", error);
    }
  };

  // 사용자 정보를 업데이트하고 데이터베이스에 저장
  const updateCoupletInfo = async (id: string, coupleName: string) => {
    try {
      const response = await apiClient.post("/coupleprofile", {
        nickname: userInfo.nickname,
        id,
        coupleName,
        month_diary: userInfo.month_diary,
        all_diary: userInfo.all_diary
      });

      if (response.data.success) {
        const updatedCoupleInfo = {
          ...userInfo,
          coupleName: response.data.coupleName,
          couple_month_diary: response.data.month_diary,
          couple_all_diary: response.data.all_diary,
        };
        setUserInfo(updatedCoupleInfo);
        await AsyncStorage.setItem("userInfo", JSON.stringify(updatedCoupleInfo));
        console.log(
          "Couple Info Updated:",
          updatedCoupleInfo.coupleName,
          updatedCoupleInfo.couple_month_diary,
          updatedCoupleInfo.couple_all_diary
        );
        setCoupleMonth(updatedCoupleInfo.couple_month_diary);
        setCoupleAll(updatedCoupleInfo.couple_all_diary);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      // 에러 메시지 확인 후 Alert 처리
      if (error instanceof Error && (error as any).response && (error as any).response.data) {
        const { message } = (error as any).response.data;
        if (message === "already couple") {
          Alert.alert(
            "경고",
            "이미 커플이 있습니다.",
            [{ text: "확인", onPress: () => console.log("Alert dismissed") }],
            { cancelable: false }
          );
        } else if (message === "The specified user does not exist.") {
          Alert.alert(
            "오류",
            "지정된 사용자를 찾을 수 없습니다.",
            [{ text: "확인", onPress: () => console.log("Alert dismissed") }],
            { cancelable: false }
          );
        } else {
          Alert.alert("오류", "알 수 없는 문제가 발생했습니다.");
        }
      } else {
        Alert.alert("오류", "서버와의 연결 중 문제가 발생했습니다.");
      }
      console.error("Error updating couple info:", error);
    }
  };
  
  const renderModal = () => {
    switch(modal) {
      case 0:
        return <></>;
      case 1: 
        return <UserModal handlemodal={handleModal} updateUserInfo={updateUserInfo}/>;
      case 2: 
        return <CoupleModal handlemodal={handleModal} updateCoupleInfo={updateCoupletInfo}  userid={userInfo.id}/>;
      default:
        return <></>;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      // 페이지에 들어올 때 애니메이션 트리거
      setAnimateUser(true);

      // 애니메이션 종료 시 상태 초기화
      const resetAnimations = setTimeout(() => {
        setAnimateUser(false);
      }, 1000); // 애니메이션 지속 시간과 일치시킴

      return () => clearTimeout(resetAnimations); // 언마운트 시 클린업
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
      {renderModal()}
      <Animatable.View
        animation={animateUser ? 'fadeInUp' : undefined}
        duration={500}       // 애니메이션 지속 시간
        delay={100}          // 애니메이션 딜레이 (ms)
        style={{ marginBottom: 10 }}
      >
        <UserInfoComponent 
          name={userInfo ? userInfo.nickname || "???" : "???"} 
          month_diary={userInfo ? userInfo.month_diary || 0 : 0}
          all_diary={userInfo ? userInfo.all_diary || 0 : 0}
          diarycount = {userInfo ? userInfo.diaryCounts || 0 : 0}
          handleModal={handleModal} 
          daysPassed={daysPassed}
        />
      </Animatable.View>
      <Animatable.View
        animation={animateUser ? 'fadeInUp' : undefined}
        duration={800}       // 애니메이션 지속 시간
        delay={500}          // 애니메이션 딜레이 (ms)
        style={{ marginBottom: 20 }}
      >
        <CoupleInfoComponent 
          name={coupleName || "???"}
          handleModal={handleModal} 
          couple_month={couple_month || 0}
          couple_all={couple_all || 0}
          diarycount = {userInfo ? userInfo.coupleCounts || 0 : 0}
          daysPassed={daysPassed}
        />
      </Animatable.View>
    </View>
  );
};

export default MyInfoScreen;