import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { apiClient } from '../utils/apiClient';
import KeyboardAvoidComponent from '../components/KeyboardAvoidComponent';

// myFace 이미지 import
const angry = require('../images/myFace/angry.png');
const sad = require('../images/myFace/sad.png');
const neutral = require('../images/myFace/normal.png');
const happy = require('../images/myFace/smile.png');
const veryhappy = require('../images/myFace/happy.png');

const EditDiaryScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { diaryId } = route.params; // 이전 화면에서 전달받은 diaryId
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(''); // "****-**-** "
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [user_id, setUser_id] = useState('');
  // mood를 string 대신 number로 관리 (1~5)
  const [mood, setMood] = useState<number | null>(null);
  const [privacy, setPrivacy] = useState<'Private' | 'Couple' | null>('Private');

  // 백엔드에서 일기 데이터 가져오기
  const fetchDiaryData = async () => {
    try {

      const response = await apiClient.post(`/diary/edit-search`, {
        id: diaryId,
      });
      if (response.data) {
        setDate(new Date(response.data.diary_date));
        setDay(response.data.diary_date);
        setHeadline(response.data.title);
        setContent(response.data.content);
        setUser_id(response.data.user_id);
        // feeling을 숫자로 바로 저장 (1~5)
        setMood(response.data.feeling || null);
        setPrivacy(response.data.privacy); // "Private" or "Couple"

      } else {

      }
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchDiaryData(); // 화면이 로드될 때 데이터 가져오기
  }, []);

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleSave = async () => {
    const diaryData = {
      title: headline,
      id: diaryId,
      user_id: user_id,
      content: content,
      // mood는 이미 숫자이므로 그대로 전송
      feeling: mood,
      privacy: privacy,
      diary_date: day,
    };

  
    try {
      const response = await apiClient.post('/diary/edit-diary', diaryData);
  

      const data = response.data;
  
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

    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete('/diary/delete-diary', {
        data: { id: diaryId },
      });

      const data = response.data;
      if (data) {
        navigation.navigate('Main');
      } else {
        Alert.alert(`Failed to delete diary: ${data.error}`);
      }
    } catch (error) {

    }
  };

  // mood 옵션 배열 (value와 해당 이미지)
  const moodOptions = [
    { value: 1, image: sad },
    { value: 2, image: angry },
    { value: 3, image: neutral },
    { value: 4, image: happy },
    { value: 5, image: veryhappy },
  ];

  return (
    <KeyboardAvoidComponent>
      <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputHeadline}
          placeholder="Headline"
          value={headline}
          onChangeText={setHeadline}
        />
        <TextInput
          style={styles.inputContent}
          placeholder="Start typing..."
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>

      {/* mood 선택: 기존 이모티콘 Text 대신 이미지로 표시 */}
      <View style={styles.moodContainer}>
        {moodOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.moodButton, mood === option.value && styles.moodButtonSelected]}
            onPress={() => setMood(option.value)}
          >
            <Image 
              source={option.image} 
              style={{ width: 40, height: 40 }} 
              resizeMode="contain" 
            />
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
              privacy === option && styles.privacyOptionSelected
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
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
      </KeyboardAvoidComponent>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: 393,
      height: 852,
      backgroundColor: 'white',
      padding: 20,
      alignSelf: 'center',
      justifyContent: 'flex-start',
  },
  header: {
      width: '100%',
      height: 57,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#FAC6DC80',
      shadowOffset: { width: 5, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10,
  },
  dateText: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  inputContainer: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      shadowColor: '#FF5C85',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
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
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
  },
  moodButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff', // 기본 배경색 지정
    borderWidth: 1,
    borderColor: '#FAC6DC',
    marginHorizontal: 8,
  },
  moodButtonSelected: {
    backgroundColor: '#FAC6DC', // 선택됐을 때의 배경색 지정
  },
  privacyContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      shadowColor: '#FF5C85',
      shadowOffset: { width: 8, height: 8 },
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
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
  },
  saveButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'white',
    opacity: 0.7,
    padding: 12,
    borderRadius: 8,
    borderColor:'red',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#FF5C85',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  deleteButtonText: {
      color: 'red',
      fontSize: 16,
      fontWeight: 'bold',
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