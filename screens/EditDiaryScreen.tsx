/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { apiClient } from '../utils/apiClient';

const EditDiaryScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { diaryId } = route.params; // 이전 화면에서 전달받은 diaryId
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(''); // "****-**-** "
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [user_id, setUser_id] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'Private' | 'Couple' | null>('Private');

  // 백엔드에서 일기 데이터 가져오기
  const fetchDiaryData = async () => {
    try {
        console.log(diaryId);
        const response = await apiClient.post(`/diary/edit-search`, {
          id: diaryId,
        });
      if(response.data){
        setDate(new Date(response.data.diary_date));
        setDay(response.data.diary_date);
        setHeadline(response.data.title);
        setContent(response.data.content);
        setUser_id(response.data.user_id);
        setMood(response.data.feeling ? ['😞', '😠', '😐', '😊', '😄'][response.data.feeling - 1] : null);
        setPrivacy(response.data.privacy); // "Private" or "Couple"
        console.log("Data: ",response.data)
      } else {
        console.error('Error fetching diary data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching diary data:', error);
    }
  };

  useEffect(() => {
    fetchDiaryData(); // 화면이 로드될 때 데이터 가져오기
  }, []);

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handlePrevDate = () => {
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
    setDate(prevDate);
  };

  const handleNextDate = () => {
    const currentDate = new Date();
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    if (nextDate <= currentDate) {
      setDate(nextDate);
    }
  };

  const getMoodIndex = (emoji: string | null) => {
    const moods = ['😞', '😠', '😐', '😊', '😄'];
    return emoji ? moods.indexOf(emoji) + 1 : 0;
  };

  const handleSave = async () => {
    const diaryData = {
      title: headline,
      id: diaryId,
      user_id: user_id,
      content: content,
      feeling: getMoodIndex(mood),
      privacy: privacy,
      diary_date: day,
    };
    console.log("diaryData : ", diaryData);
  
    try {
      const response = await apiClient.post('/diary/edit-diary', diaryData);
  
      console.log("API Response:", response); // 추가된 로그
      const data = response.data; // response.data를 직접 가져오기
  
      if (data) {
        navigation.navigate('Detail', {
          clickdate: date.getDate(),
          clickmonth: date.getMonth(),
          clickyear: date.getFullYear(),
          userid: data.user_id,
        });
      } else {
        Alert.alert(`Failed to save diary: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving diary data:', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          {/* <Text style={styles.Text} onPress={handlePrevDate}>◀</Text> */}
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          {/* <Text style={styles.Text} onPress={handleNextDate}>▶</Text> */}
      </View>
      <View style={{marginBottom: 15,
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
        elevation: 5,}}>
        <TextInput
          style={styles.inputHeadline}
          placeholder="Headline"
          value={headline} // Input 값 초기화
          onChangeText={setHeadline}
        />
        <TextInput
          style={styles.inputContent}
          placeholder="Start typing..."
          value={content} // Input 값 초기화
          onChangeText={setContent}
          multiline
        />
      </View>

      <View style={styles.moodContainer}>
        {['😞', '😠', '😐', '😊', '😄'].map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.moodButton, mood === emoji && styles.moodButtonSelected]}
            onPress={() => setMood(emoji)}
          >
            <Text style={styles.moodText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.privacyContainer}>
        {['Private', 'Couple'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.privacyOption,
              styles.boxShadow,
              privacy === option && styles.privacyOptionSelected // 조건부 스타일링
            ]}
            onPress={() => setPrivacy(option as 'Private' | 'Couple')}
          >
            <Text style={[styles.privacyText, privacy === option && styles.privacyTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: 393,
      height: 852,
      backgroundColor: 'white',
      // borderRadius: 30,
      // borderTopRightRadius: 0,
      // borderBottomRightRadius: 0,
      padding: 20,
      alignSelf: 'center',
      justifyContent: 'flex-start',
      gap: 0,
  },
  header: {
      width: '100%',
      height: 57,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginBottom: 20,
      shadowColor: '#FAC6DC80',
      shadowOffset: { width: 5, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10,
  },
  Text: {
      fontFamily: 'Manrope',
      fontSize: 17,
      lineHeight: 24,
  },
  dateText: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  questionContainer: {
      height : "20%",
      justifyContent: 'center',
      marginBottom: 15,
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
  questionText: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  nextButton: {
      backgroundColor: '#F6A5C0',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 15,
      shadowColor: '#FF5C85',
      shadowOffset: {
      width: 8,
      height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
  },
  nextButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  inputHeadline: {
      backgroundColor: '#FFF',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      borderBottomWidth: 0.5,
      borderBottomColor : 'lightgray'
  },
  inputContent: {
      backgroundColor: '#FFF',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      minHeight: 300,
      textAlignVertical: 'top',
      borderTopWidth : 1,
      borderTopColor: 'gray',
      marginBottom: 16,
  },
  moodContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
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
      elevation: 5,
  },
  moodButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#FFF',
      shadowColor: '#FAC6DC80',
      shadowOffset: { width: 5, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 1,
      borderColor: '#FAC6DC',
      marginHorizontal: 8,
  },
  moodButtonSelected: {
      backgroundColor: '#FAC6DC',
  },
  moodText: {
      fontSize: 24,
  },
  privacyContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
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
      elevation: 5,
  },
  privacyOption: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#FAC6DC',
      marginHorizontal: 8,
  },
  privacyOptionSelected: {
      backgroundColor: '#FAC6DC',
  },
  privacyText: {
      fontSize: 16,
      color: '#555',
  },
  privacyTextSelected: {
      color: '#000',
      fontWeight: 'bold',
  },
  saveButton: {
      backgroundColor: '#F6A5C0',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 15,
      shadowColor: '#FF5C85',
      shadowOffset: {
      width: 8,
      height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
  },
  saveButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  reviewContainer: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 20,
  },
  reviewDate: {
      fontSize: 16,
      color: '#888',
      marginBottom: 10,
  },
  reviewMood: {
      fontSize: 24,
      marginBottom: 10,
  },
  reviewHeadline: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  reviewContent: {
      fontSize: 16,
      marginBottom: 10,
  },
  reviewPrivacy: {
      fontSize: 14,
      color: '#888',
  },
  boxShadow: {
      shadowColor: '#FAC6DC80',
      shadowOffset: { width: 5, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10,
  },
});

export default EditDiaryScreen;