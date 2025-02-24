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
  TouchableWithoutFeedback,
  Keyboard,
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
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
      <View style={styles.container}>
        <View style={styles.diaryCard}>
          <View style={styles.ribbon}>
            <View style={styles.ribbonEnd} />
          </View>

          {/* Date Header */}
          <View style={styles.navigationHeader}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
          </View>

          {/* Mood Selection */}
          <View style={styles.emotionSection}>
            <View style={styles.moodContainer}>
              {moodOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moodButton,
                    mood === option.value && styles.moodButtonSelected
                  ]}
                  onPress={() => setMood(option.value)}
                >
                  <Image 
                    source={option.image} 
                    style={styles.moodImage} 
                    resizeMode="contain" 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.titleSection}>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력하세요"
              value={headline}
              onChangeText={setHeadline}
              placeholderTextColor="#FFB6C1"
            />
          </View>

          {/* Content Input */}
          <View style={styles.contentWrapper}>
            <TextInput
              style={styles.contentInput}
              placeholder="일기를 작성해주세요..."
              value={content}
              onChangeText={setContent}
              multiline
              placeholderTextColor="#FFB6C1"
            />
          </View>

          {/* Privacy Options */}
          <View style={styles.privacySection}>
            {['Private', 'Couple'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.privacyOption,
                  privacy === option && styles.privacyOptionSelected
                ]}
                onPress={() => setPrivacy(option as 'Private' | 'Couple')}
              >
                <Text style={[
                  styles.privacyText,
                  privacy === option && styles.privacyTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </KeyboardAvoidComponent>
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
    paddingHorizontal: 10,
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
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    color: '#FF6699',
    fontWeight: '600',
  },
  emotionSection: {
    marginVertical: 20,
    width: '100%',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  moodButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#FFE5EC',
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  moodButtonSelected: {
    backgroundColor: '#FF9CB1',
    borderColor: '#FF8BA7',
  },
  moodImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  titleSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6699',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FFE5EC',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#FFE5EC',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  privacySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  privacyOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#FFE5EC',
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  privacyOptionSelected: {
    backgroundColor: '#FF9CB1',
    borderColor: '#FF8BA7',
  },
  privacyText: {
    fontSize: 16,
    color: '#FF6699',
    fontWeight: '500',
  },
  privacyTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#FF9CB1',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8BA7',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6666',
  },
  deleteButtonText: {
    color: '#FF6666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditDiaryScreen;