import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';
import KeyboardAvoidComponent from '../components/KeyboardAvoidComponent';
// 이모티콘 이미지 import (myFace 폴더 내 이미지)
const angry = require('../images/myFace/angry.png');
const sad = require('../images/myFace/sad.png');
const neutral = require('../images/myFace/normal.png');
const happy = require('../images/myFace/smile.png');
const veryhappy = require('../images/myFace/happy.png');



const PreDiaryQuestionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [date, setDate] = useState(new Date());

    const [randomQuestions, setRandomQuestions] = useState<string[]>([]);

    const formatDate = (date: Date) => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const handlePrevDate = () => {
        const prevDate = new Date(date);
        prevDate.setDate(date.getDate() - 1);
        setDate(prevDate);
        generateRandomQuestions();
    };

    const handleNextDate = () => {
        const currentDate = new Date();
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        if (nextDate <= currentDate) {
            setDate(nextDate);
            generateRandomQuestions();
        }
    };

    // 질문 리스트
    const allQuestions = [
        `하루는 전반적으로 어떠셨나요?`,
        `인상깊은 일은 무엇이었나요?`,
        `스스로에게 칭찬해주고 싶은 일이 있었나요?`,
        `가장 행복했던 순간은 무엇인가요?`,
        `하루 중 힘들었던 순간이 있나요?`,
        `새로운 시도를 해본 것이 있나요?`,
        `하루가 스스로에게 만족스럽나요?`,
        `하루가 다시 돌아온다면 무엇을 더 잘해보고 싶나요?`,
        `하루 중 누군가에게 감사한 일이 있었나요?`,
        `하루 중 배우거나 깨달은 점이 있나요?`,
        '하루 중 나를 가장 웃게 만든 일은 무엇인가요?',
        '누군가에게 미안한 일이 있었나요?',
        '하루를 색으로 표현한다면 무슨 색인가요? 그 이유가 무엇인가요?'
    ];

    // 랜덤 질문 3개 선택
    const generateRandomQuestions = () => {
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        setRandomQuestions(shuffled.slice(0, 3));
    };

    // 컴포넌트가 처음 렌더링될 때 랜덤 질문 생성
    React.useEffect(() => {
        generateRandomQuestions();
    }, []);

    const handleNext = () => {
        navigation.navigate('WriteDiaryScreen', { date: date.toISOString() });
    };

    return (
        <View style={[styles.container,{justifyContent:'center'}]}>
            <View style={[styles.diaryCard, { flex: 0.8 }]}>
                <View style={styles.ribbon}>
                    <View style={styles.ribbonEnd} />
                </View>

                {/* Date Header */}
                <View style={styles.navigationHeader}>
                    <TouchableOpacity onPress={handlePrevDate} style={styles.navButton}>
                        <Text style={styles.navButtonText}>◀</Text>
                    </TouchableOpacity>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{formatDate(date)}</Text>
                    </View>
                    <TouchableOpacity onPress={handleNextDate} style={styles.navButton}>
                        <Text style={styles.navButtonText}>▶</Text>
                    </TouchableOpacity>
                </View>

                {/* Questions */}
                <View style={styles.questionsSection}>
                    {randomQuestions.map((question, index) => (
                        <View key={index} style={styles.questionBox}>
                            <Text style={styles.questionText}>{question}</Text>
                        </View>
                    ))}
                </View>

                {/* Next Button */}
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>다음으로</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const WriteDiaryScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    // const [date, setDate] = useState(route.params?.date ? new Date(route.params.date) : new Date());
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string | null>(null);
    const [privacy, setPrivacy] = useState<'Private' | 'Couple' | null>('Private');
    const [user_id, setUser_id] = useState<string>('');
    const initialDate = route.params?.date ? new Date(route.params.date) : new Date();
    const [date, setDate] = useState(initialDate);

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

    useEffect(() => {
        const getUserInfo = async () => {
          try {
            const user = await AsyncStorage.getItem('userInfo');
            if (user) {
              const parsedUser = JSON.parse(user);
              setUser_id(parsedUser.id);
            }
          } catch (error) {

          }
        };
        getUserInfo();
    }, []);

    const handleSave = async () => {
        if (!headline || !content || !mood) {
            Alert.alert('모든 칸을 채우거나 기분을 체크해주세요!');
            return;
        }
    
        const diaryData = {
            title: headline,
            user_id,
            content,
            feeling: getMoodIndex(mood),
            privacy,
            diary_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        };
    
        try {
            const response = await apiClient.post("/diary/write", diaryData);
    
            if (response.status === 200) {
                // 성공적으로 저장 후 홈 화면으로 이동
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                  });
            } else if (response.status === 401) {
                Alert.alert('이미 일기를 썼습니다.');
            } else {
                Alert.alert('Failed to save diary data');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                Alert.alert('이미 일기를 썼습니다.');
            }
    
            Alert.alert('Failed to save diary data');
        }
    };
      
    const moodOptions = [
        { value: '😞', image: sad },
        { value: '😠', image: angry },
        { value: '😐', image: neutral },
        { value: '😊', image: happy },
        { value: '😄', image: veryhappy },
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
                        <TouchableOpacity onPress={handlePrevDate} style={styles.navButton}>
                            <Text style={styles.navButtonText}>◀</Text>
                        </TouchableOpacity>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{formatDate(date)}</Text>
                        </View>
                        <TouchableOpacity onPress={handleNextDate} style={styles.navButton}>
                            <Text style={styles.navButtonText}>▶</Text>
                        </TouchableOpacity>
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
        
                    {/* Title & Content Input */}
                    <View style={styles.titleSection}>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="제목을 입력하세요"
                            value={headline}
                            onChangeText={setHeadline}
                            placeholderTextColor="#FFB6C1"
                        />
                    </View>
        
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
        
                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>저장하기</Text>
                    </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
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
    questionsSection: {
        flex: 1,
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 10,
        gap: 15, // 질문들 사이의 간격
    },
    questionBox: {
        flex: 0.25,
        backgroundColor: '#FFE5EC',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFB6C1',
        // 그림자 효과 추가
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    questionText: {
        fontSize: 16,
        color: '#FF6699',
        lineHeight: 24,
        textAlign: 'center',
        fontWeight: '500',
    },
    nextButton: {
        backgroundColor: '#FF9CB1',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF8BA7',
        marginHorizontal: 10,
        marginTop: 10, // 버튼 위 여백 추가
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    dateText: {
        width: 50,
        textAlign: 'center',
        fontSize: 18,
        color: '#FF6699',
        fontWeight: '600',
    },
    emotionSection: {
        marginVertical: 15,
        width: '100%',
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFE5EC',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    moodButton: {
        padding: 8,
        borderRadius: 15,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#FFB6C1',
    },
    moodButtonSelected: {
        backgroundColor: '#FF9CB1',
        borderColor: '#FF8BA7',
    },
    moodImage: {
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    titleSection: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 15,
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
        marginBottom: 15,
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
        marginBottom: 15,
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
    saveButton: {
        backgroundColor: '#FF9CB1',
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF8BA7',
        marginHorizontal: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export { PreDiaryQuestionsScreen, WriteDiaryScreen };