/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useFocusEffect } from '@react-navigation/native';
import React , {useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import EditDiaryScreen from './EditDiaryScreen';
import { apiClient } from '../utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
const angry = require('../images/myFace/angry.png');
const sad = require('../images/myFace/sad.png');
const neutral = require('../images/myFace/normal.png');
const happy = require('../images/myFace/smile.png');
const veryhappy = require('../images/myFace/happy.png');

const angry2 = require('../images/CoupleFace/angry.png');
const sad2 = require('../images/CoupleFace/sad.png');
const neutral2 = require('../images/CoupleFace/normal.png');
const happy2 = require('../images/CoupleFace/smile.png');
const veryhappy2 = require('../images/CoupleFace/happy.png');

const setEmoteType = (emote: number | undefined) => {
  switch(emote) {
      case 1:
          return sad;
      case 2:
          return angry;
      case 3:
          return neutral;
      case 4:
          return happy;
      case 5:
          return veryhappy;
      default:
          return null;
  }
}
const setCoupleEmoteType = (emote: number | undefined) => {
  switch(emote) {
      case 1:
          return sad2;
      case 2:
          return angry2;
      case 3:
          return neutral2;
      case 4:
          return happy2;
      case 5:
          return veryhappy2;
      default:
          return null;
  }
}

const setMonthName = (month: number) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month];
}

type Diary = {
  content: string;
  diary_date: string;
  feeling: number;
  id: number;
  title: string;
  user_id: string;
  privacy: string;
};

const DiaryDetailScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { clickdate , clickmonth , clickyear, userid} = route.params;
  const [ diary, setDiary] = useState<Diary | null>(null);
  const [date, setDate] = useState(clickdate);
  const [month, setMonth] = useState(clickmonth);
  const [year, setYear] = useState(clickyear);
  const [modalVisible, setModalVisible] = useState(false);
  const now = new Date().getDate();
  const nowMonth = new Date().getMonth();
  const emoteToday = setEmoteType(diary?.feeling);
  const emoteCouple = setCoupleEmoteType(diary?.feeling);
  
  const monthName = setMonthName(clickmonth);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  const formatDate = (year: number, month: number, day: number) => {
    const formattedMonth = (month + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  
  useFocusEffect(
    React.useCallback(() => {
      const getCurrentUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userid");
          if (storedUserId) {
            setCurrentUserId(storedUserId);
          }
        } catch (error) {

        }
      };
      
      getCurrentUserId();
      
      const diary_date = formatDate(year, month, date);

      fetchUsers(userid, diary_date);
    }, [])
  );
  
  useEffect(() => {
    const diary_date = formatDate(year, month, date);
    fetchUsers(userid, diary_date);
  }, [date]);
  

  const movebackward = () => {
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();
    if (date == 1) {
      if (month == 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
      setDate(lastDateOfPrevMonth);
    } else {
      setDate(date - 1);
    }
  };

  const moveforward = () => {
    const lastDateOfCurrentMonth = new Date(year, month + 1, 0).getDate();
    if (date === lastDateOfCurrentMonth) {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
      setDate(1);
    } else {
      setDate(date + 1);
    }
  };

  const fetchUsers = async (userId: string, diaryDate: string) => {
    try {
      const response = await apiClient.post(`/detail`,
        { user_id: userId, diary_date: diaryDate }
      );
      const json = await response.data;
      if (json.success) {
        setDiary(json.data[0]);
      } else {

        setDiary(null);
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    const diary_date = `${year}-${month+1}-${date}`;
    fetchUsers(userid, diary_date);
  }, [date]);

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, styles.row, {height: '5%'}]}>
        <TouchableOpacity onPress={() => movebackward()} style={styles.arrowBox}>
          <Text style={styles.Text}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerBox}>
          <Text style={styles.Text}>📅 {month+1}/{date} Today</Text>
        </View>
        <TouchableOpacity onPress={() => moveforward()} style={styles.arrowBox}>
          <Text style={styles.Text}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.cardContainer, { height : '80%'}]}>

        <View style={{width: '100%', height: '12%'}}>
          <View style={{flexDirection:'row', width: '100%', height: '50%', marginTop:20, justifyContent:'space-between'}}>
            {
              diary?.id && currentUserId === userid  ? (
                <>
                  <Image 
                    source={emoteToday} 
                    style={{width: '20%',height:'100%', resizeMode:'contain'}}
                    resizeMode="contain"
                  />
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('EditDiaryScreen', {diaryId: diary?.id } )} 
                    style={{
                      width:'17%',
                      height: '100%', 
                      marginRight: 30,
                      alignItems: 'flex-end', 
                      justifyContent: 'center'
                    }}>
                    <Text style={{fontSize: 16, width: '100%', textAlign: 'right'}}>edit</Text>
                  </TouchableOpacity>
                </>
            ) 
              :(<>
                  <Image 
                    source={emoteCouple} 
                    style={{width: '20%',height:'100%', resizeMode:'contain'}}
                    resizeMode="contain"
                  />
                </>)
            }
            
          </View>
          <View style={{height:'40%', marginTop:'5%'}}>
            <View style={[styles.highlightBox, {marginLeft: 10}]}>
              <Text style={[{textAlignVertical:'center'},styles.Text]}>
                🕗 {monthName} {date}</Text>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', width: '100%', height: '10%', marginTop: "10%",marginBottom: '5%'}}>
          <View style={{width: '90%', height: '100%', margin: '5%'}}>
            {diary == null ? <></>
            : <Text 
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.titleText}
              >
                {diary.title}
              </Text>
            }
          </View>
        </View>
          
        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {diary == null ? 
              <Text>작성된 일기가 없습니다.</Text>
              : <Text style={styles.Text}>{diary.content}</Text>
            }
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "white"
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '90%',
    margin: '5%',
    padding: '1.5%',  
    shadowColor: '#FF5C85',
    shadowOffset: {
      width: 5,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
  },
  arrowBox: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBox:{
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    fontFamily: 'Manrope',
    fontSize: 17,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // ios 에서 안보임
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  highlightBox: {
    backgroundColor: '#F5BFD9',
    flexDirection: 'row',
    borderRadius: 10,
    width: '40%',
    height: '100%',
    padding: '1%',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 40,
    fontFamily: 'Manrope',
    overflow: 'hidden',
  },
  modal: {
    width: '20%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    height: '70%',
    width: '90%',
    marginTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
});

export default DiaryDetailScreen;