import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native';
import { apiClient } from '../utils/apiClient';
import AsyncStorage from "@react-native-async-storage/async-storage";

type CoupleInfoComponentProps = {
  name : string
  daysPassed : number
  diarycount : { [key: number]: number }
  couple_month : number
  couple_all : number
  onDeleteSuccess: () => void 
}
const CoupleInfoComponent:React.FC<CoupleInfoComponentProps> = ({name,daysPassed,diarycount, couple_month, couple_all, onDeleteSuccess }) => {
  const handleDeleteCouple = () => {
    Alert.alert(
      "커플 삭제",
      "채팅도 삭제됩니다. 정말 커플 관계를 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "삭제",
          style: "destructive",  // iOS에서 빨간색으로 표시됩니다
          onPress: async () => {
            try {
              const response = await apiClient.post("/mypage/delete-couple");
              await AsyncStorage.removeItem("groupid");
              await AsyncStorage.removeItem("chatdata");
              if (response.data.success) {
                Alert.alert("성공", "커플 관계가 삭제되었습니다.");
                onDeleteSuccess(); 
                // 성공 후 필요한 상태 업데이트나 화면 새로고침 로직 추가
              } else {
                Alert.alert("오류", "커플 삭제에 실패했습니다.");
              }
            } catch (error) {
              console.error("Error deleting couple:", error);
              Alert.alert("오류", "서버 오류가 발생했습니다.");
            }
          }
        }
      ]
    );
  };
  
  const mood = ['sad','angry','normal','smile','happy'];
  const moodImages: { [key: string]: any } = {
    sad: require("../images/CoupleFace/sad.png"),
    angry: require("../images/CoupleFace/angry.png"),
    normal: require("../images/CoupleFace/normal.png"),
    smile: require("../images/CoupleFace/smile.png"),
    happy: require("../images/CoupleFace/happy.png"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View style={{height: 50}}>
          <Text style={{
            fontSize: 25,
            fontWeight: 'bold',
          }}>{name}</Text>
          <Text style={{
            fontSize: 15, 
          }}>{daysPassed!==-1 ? `D+${daysPassed}` : "D+???"}</Text>
        </View>
        <View style={{height:30}}>
          <TouchableOpacity onPress={handleDeleteCouple}>
            <Text style={{
              paddingTop: 10,
              color: '#FF5C85'
            }}>커플 삭제하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contents}>
          <Text style={styles.contentText}>한달동안 쓴 일기 : {couple_month}개</Text>
          <Text style={styles.contentText}>총 일기 : {couple_all}개</Text>
      </View>
      <View style={styles.moodcontainer}>
        <Text style={styles.contentText}>한달동안의 기분</Text>
        <View style={styles.imglist}>
          {mood.map((item, index) => (
            <View style={styles.facecontainer} key={item}>
              <Image source={moodImages[item]} style={styles.icons} />
              <Text>{diarycount[index + 1] || 0}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    width: 350,
    height: 300,
    marginBottom: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#FF5C85',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  title : {
    flex: 0.3,
    height: 50,
    margin: 10,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contents : {
    margin: 10,
    marginTop: 30,
  },
  contentText : {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  moodcontainer : {
    marginLeft: 10,
    marginRight: 10,
  },
  facecontainer:{
    marginRight: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imglist:{
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: "space-evenly"
  },
  icons : {
    width: 40,
    height: 40,
    resizeMode : "center",
    marginBottom: 5,
  }
})

export default CoupleInfoComponent;