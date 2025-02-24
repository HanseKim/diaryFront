import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';

// 이모지 이미지 imports
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
    case 1: return sad;
    case 2: return angry;
    case 3: return neutral;
    case 4: return happy;
    case 5: return veryhappy;
    default: return null;
  }
}

const setCoupleEmoteType = (emote: number | undefined) => {
  switch(emote) {
    case 1: return sad2;
    case 2: return angry2;
    case 3: return neutral2;
    case 4: return happy2;
    case 5: return veryhappy2;
    default: return null;
  }
}

const setMonthName = (month: number) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
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
  const { clickdate, clickmonth, clickyear, userid } = route.params;
  const [diary, setDiary] = useState<Diary | null>(null);
  const [date, setDate] = useState(clickdate);
  const [month, setMonth] = useState(clickmonth);
  const [year, setYear] = useState(clickyear);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  const emoteToday = setEmoteType(diary?.feeling);
  const emoteCouple = setCoupleEmoteType(diary?.feeling);
  const monthName = setMonthName(clickmonth);

  const formatDate = (year: number, month: number, day: number) => {
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const movebackward = () => {
    const lastDateOfPrevMonth = new Date(year, month, 0).getDate();
    if (date === 1) {
      if (month === 0) {
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
      console.error('Error fetching diary:', error);
    }
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
          console.error('Error getting user ID:', error);
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

  return (
    <View style={styles.container}>
      <View style={styles.diaryCard}>
        <View style={styles.ribbon}>
          <View style={styles.ribbonEnd} />
        </View>

        {/* Navigation Header */}
        <View style={styles.navigationHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{monthName} {date}</Text>
          </View>
        </View>

        {/* Emotion and Edit Section */}
        <View style={styles.emotionSection}>
          <View style={styles.emotionContainer}>
            {diary?.id && currentUserId === userid ? (
              <>
                <Image 
                  source={emoteToday} 
                  style={styles.emotionImage}
                  resizeMode="contain"
                />
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EditDiaryScreen', {diaryId: diary?.id})}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>수정하기</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Image 
                source={emoteCouple} 
                style={styles.emotionImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>

        {/* Title Section */}
        {diary && (
          <View style={styles.titleSection}>
            <Text 
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.titleText}
            >
              {diary.title}
            </Text>
          </View>
        )}

        {/* Content Section */}
        <ScrollView style={styles.contentContainer}>
          {diary ? (
            <Text style={styles.contentText}>{diary.content}</Text>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>작성된 일기가 없습니다.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    paddingTop: 60,
    alignItems: 'center',
  },
  diaryCard: {
    width: '95%',
    flex: 0.92,
    marginTop: 25,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFE5EC',
  },
  ribbon: {
    zIndex: 40,
    position: 'absolute',
    top: -15,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 30,
    backgroundColor: '#FF9CB1',
    borderRadius: 8,
    transform: [{ rotate: '-5deg' }],
  },
  ribbonEnd: {
    position: 'absolute',
    bottom: -10,
    left: 20,
    width: 20,
    height: 20,
    backgroundColor: '#FF9CB1',
    transform: [{ rotate: '45deg' }],
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    width: 45,
    height: 45,
    backgroundColor: '#FFE5EC',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  navButtonText: {
    fontSize: 18,
    color: '#FF6699',
  },
  dateContainer: {
    backgroundColor: '#FFE5EC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  dateText: {
    width: 150,
    textAlign: 'center',
    fontSize: 18,
    color: '#FF6699',
    fontWeight: '600',
  },
  emotionSection: {
    marginVertical: 20,
    width: '100%',
  },
  emotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emotionImage: {
    width: 60,
    height: 60,
  },
  editButton: {
    backgroundColor: '#FF9CB1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF8BA7',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6699',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFE5EC',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#FF9CB1',
    fontWeight: '500',
  },
});

export default DiaryDetailScreen;