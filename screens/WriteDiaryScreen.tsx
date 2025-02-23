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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.Text} onPress={handlePrevDate}>◀</Text>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <Text style={styles.Text} onPress={handleNextDate}>▶</Text>
            </View>

            {randomQuestions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question}</Text>
                </View>
            ))}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const WriteDiaryScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    const [date, setDate] = useState(route.params?.date ? new Date(route.params.date) : new Date());
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string | null>(null);
    const [privacy, setPrivacy] = useState<'Private' | 'Couple' | null>('Private');
    const [user_id, setUser_id] = useState<string>('');

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
                navigation.navigate('Detail', {
                    clickdate: date.getDate(),
                    clickmonth: date.getMonth(),
                    clickyear: date.getFullYear(),
                    userid: user_id,
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex:1}}
                  >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{flex:1}}>
                            <View style={styles.header}>
                                <Text style={styles.Text} onPress={handlePrevDate}>◀</Text>
                                <Text style={styles.dateText}>{formatDate(date)}</Text>
                                <Text style={styles.Text} onPress={handleNextDate}>▶</Text>
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
                                    value={headline}
                                    placeholderTextColor="#F6A5C0" 
                                    onChangeText={setHeadline}
                                />

                                <TextInput
                                    style={styles.inputContent}
                                    placeholder="Start typing..."
                                    value={content}
                                    placeholderTextColor="#F6A5C0" 
                                    onChangeText={setContent}
                                    multiline
                                />
                            </View>
                        
                            <View style={styles.moodContainer}>
                                {moodOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                        styles.moodButton,
                                        mood === option.value && styles.moodButtonSelected,
                                        ]}
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
                                        privacy === option && styles.privacyOptionSelected // 조건부 스타일링
                                    ]}
                                    onPress={() => setPrivacy(option as 'Private' | 'Couple')}
                                    >
                                    <Text
                                        style={[
                                        styles.privacyText,
                                        privacy === option && styles.privacyTextSelected // 텍스트 스타일도 조건부 적용
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        borderBottomWidth: 1,
    },
    inputContent: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        minHeight: 300,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Changed from space-around
        alignItems: 'center', // Added for vertical alignment
        marginBottom: 20,
        padding: 15,
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
        width: '100%', // Added to ensure full width
    },
    moodButton: {
        padding: 5, // Reduced padding
        borderRadius: 8,
        backgroundColor: '#FFF',
        shadowColor: '#FAC6DC80',
        shadowOffset: { width: 5, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#FAC6DC',
        width: 55, // Fixed width
        height: 55, // Fixed height
        alignItems: 'center', // Center the image
        justifyContent: 'center', // Center the image
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

export { PreDiaryQuestionsScreen, WriteDiaryScreen };