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
  Platform,
} from 'react-native';
import EditDiaryScreen from './EditDiaryScreen';
import axios from 'axios';
export const apiClient = axios.create({
  //baseURL: "http://10.0.2.2:80/", // 안드로이드 에뮬레이터용
  baseURL: "http://127.0.0.1:80/", // ios
  headers: {
    "Content-Type": "application/json",
  },
});

const setEmoteType = (emote: any) => {
  const emoteList = ['😞', '😠', '😐', '😊', '😄'];

  return emoteList[emote-1];
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
  const monthName = setMonthName(clickmonth);
  
  const formatDate = (year: number, month: number, day: number) => {
    const formattedMonth = (month + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  
  useFocusEffect(
    React.useCallback(() => {
      const diary_date = formatDate(year, month, date);
      console.log(diary_date);
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
      const response = await apiClient.post(`/detail`,{ 
        user_id: userId, 
        diary_date: diaryDate 
      });
      if(response.status === 200) {
        setDiary(response.data[0]);
      } else {
        console.error('API error:', response.data);
        setDiary(null);
      }
    } catch (error) {
      console.error('Fetch error:', error);
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
            <Text style={{width: '20%',height:'100%', textAlign: 'center', fontSize: 30}}>{emoteToday}</Text>
            {
              diary?.id ? (
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
              </TouchableOpacity>) 
              :(<></>)
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
    shadowOpacity: 1,
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