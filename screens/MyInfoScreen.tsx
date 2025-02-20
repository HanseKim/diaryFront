import React, {useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import UserInfoComponent from '../components/UserInfoComponent';
import CoupleInfoComponent from '../components/CoupleInfoComponent';
import UserModal from '../components/UserModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';
import * as Animatable from 'react-native-animatable';

const MyInfoScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const [modal, setModal] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [animateUser, setAnimateUser] = useState(false);
  const [daysPassed, setDaysPassed] = useState<number>(0);
  const [coupleName, setCoupleName] = useState<string>("");
  const [couple_month, setCoupleMonth] = useState<number>(0);
  const [couple_all, setCoupleAll] = useState<number>(0);

  const handleModal = (modal_num: number) => setModal(modal_num);
  const handleLogout = async () => {
    try {
      Alert.alert(
        "로그아웃을 하시면 채팅데이터가 삭제됩니다.", // 제목
        "진행하시겠습니까?", // 내용
        [
          {
            text: "아니오",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "예",
            onPress: async() => {
              await AsyncStorage.multiRemove(["userInfo", "userid", "userpwd", "jwtToken", "chatdata", "groupid"]);
  
              // 로그인 화면으로 이동
              navigation.navigate('Login');},
          },
        ],
        { cancelable: false } // Alert 바깥을 눌러도 닫히지 않도록 설정
      );
      //로그아웃시 로컬 데이터 전부 삭제
       // 로그인 화면의 이름에 따라 변경
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
    }
  };

  // DB에서 최신 사용자 정보 가져오기
  const fetchLatestUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      const currentUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      
      if (currentUserInfo?.id) {
        const response = await apiClient.get(`/mypage/${currentUserInfo.id}`);
        
        if (response.data.success) {
          const updatedUserInfo = {
            ...currentUserInfo,
            ...response.data.userInfo,
            month_diary: response.data.userInfo.month_diary,
            all_diary: response.data.userInfo.all_diary,
            diaryCounts: response.data.userInfo.diaryCounts,
            coupleCounts: response.data.userInfo.coupleCounts
          };

          // AsyncStorage와 상태 모두 업데이트
          await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
          setUserInfo(updatedUserInfo);
          
          // 관련 상태들 업데이트
          setCoupleName(updatedUserInfo.coupleName || "");
          setCoupleMonth(updatedUserInfo.couple_month || 0);
          setCoupleAll(updatedUserInfo.couple_all || 0);
          
          const days = calculateDaysPassed(updatedUserInfo);
          setDaysPassed(days + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching latest user info:", error);
      // 에러 발생 시 기존 AsyncStorage 데이터로 폴백
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  };

  const calculateDaysPassed = (info: any): number => {
    if (!info || !info.date) return -1;
    const startDate = new Date(info.date);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // 화면에 포커스될 때마다 최신 데이터 가져오기
  useFocusEffect(
    React.useCallback(() => {
      setAnimateUser(true);
      fetchLatestUserInfo();

      const resetAnimations = setTimeout(() => {
        setAnimateUser(false);
      }, 1000);

      return () => clearTimeout(resetAnimations);
    }, [])
  );
  
  const updateUserInfo = async (newDate: string, coupleName : any) => {
    try {
      const response = await apiClient.post("/mypage/all", {
        nickname: userInfo.nickname,
        id: userInfo.id, 
        date: newDate,
        coupleName: coupleName,
        month_diary: userInfo.month_diary,
        all_diary: userInfo.all_diary
      });
  
      if (response.data.success) {
        // 업데이트 후 최신 데이터 다시 가져오기
        await fetchLatestUserInfo();
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      if (error instanceof Error && (error as any).response?.data) {
        const { message } = (error as any).response.data;
        if (message === "already couple") {
          Alert.alert("경고", "이미 커플이 있습니다.");
        } else if (message === "The specified user does not exist.") {
          Alert.alert("오류", "지정된 사용자를 찾을 수 없습니다.");
        } else {
          Alert.alert("오류", "알 수 없는 문제가 발생했습니다.");
        }
      } else {
        Alert.alert("오류", "서버와의 연결 중 문제가 발생했습니다.");
      }
      console.error("Error updating couple info:", error);
    }
  };
  const updateUserDate = async (newDate: string) =>{
    try{
      const response = await apiClient.post("/mypage/date", {
        nickname: userInfo.nickname,
        id: userInfo.id, 
        date: newDate,
      });
  
      if (response.data.success) {
        // 업데이트 후 최신 데이터 다시 가져오기
        await fetchLatestUserInfo();
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      Alert.alert("오류", "서버와의 연결 중 문제가 발생했습니다.");
      console.error("Error updating couple info:", error);
    }
  }

  const renderModal = () => {
    switch(modal) {
      case 0: return <></>;
      case 1: return <UserModal handlemodal={handleModal} updateUserInfo={updateUserInfo} updateUserDate={updateUserDate}/>;
      default: return <></>;
    }
  }

  const renderCouple = () => {
    if(coupleName != ""){
      return (
        <Animatable.View
          animation={animateUser ? 'fadeInUp' : undefined}
          duration={800}
          delay={500}
          style={{ marginBottom: 20 }}
        >
          <CoupleInfoComponent 
            name={coupleName}
            couple_month={couple_month || 0}
            couple_all={couple_all || 0}
            diarycount={userInfo ? userInfo.coupleCounts || 0 : 0}
            daysPassed={daysPassed}
            onDeleteSuccess={fetchLatestUserInfo}
          />
        </Animatable.View>
      );
    }
    return <></>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
      {renderModal()}
      <Animatable.View
        animation={animateUser ? 'fadeInUp' : undefined}
        duration={500}
        delay={100}
        style={{ marginBottom: 10 }}
      >
        <UserInfoComponent 
          name={userInfo ? userInfo.nickname || "???" : "???"} 
          month_diary={userInfo ? userInfo.month_diary || 0 : 0}
          all_diary={userInfo ? userInfo.all_diary || 0 : 0}
          diarycount={userInfo ? userInfo.diaryCounts || 0 : 0}
          handleModal={handleModal} 
          daysPassed={daysPassed}
        />
      </Animatable.View>
      {renderCouple()}
      <Animatable.View
        animation={animateUser ? 'fadeInUp' : undefined}
        duration={1000}
        delay={500}
        style={{ marginBottom: 10 }}
      >
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutbtn}>
          <Text style={{ color: 'black', fontWeight:'bold' }}>
            로그아웃
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutbtn: {
    width: 250, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 30,
    backgroundColor: 'rgba(255, 92, 133, 0.1)', // 배경색에 투명도 적용
    borderWidth: 2,
    borderColor: 'rgba(255, 92, 133, 0.5)'
  },
});

export default MyInfoScreen;