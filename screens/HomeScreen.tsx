import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
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

// Helper 함수들
const setMonthName = (month: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[month];
};

const setMyEmoteType = (emote: number) => {
    switch(emote) {
        case 1: return sad;
        case 2: return angry;
        case 3: return neutral;
        case 4: return happy;
        case 5: return veryhappy;
        default: return null;
    }
};

const setCoupleEmoteType = (emote: number) => {
    switch(emote) {
        case 1: return sad2;
        case 2: return angry2;
        case 3: return neutral2;
        case 4: return happy2;
        case 5: return veryhappy2;
        default: return null;
    }
};

function generateCalender(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let currentRow = [];
    
    for (let i = 0; i < firstDay; i++) {
        currentRow.push(null);
    }

    for (let day = 1; day <= lastDate; day++) {
        currentRow.push(day);
    
        if (currentRow.length === 7) {
            weeks.push(currentRow);
            currentRow = [];
        }
    }

    if (currentRow.length > 0) {
        while (currentRow.length < 7) {
            currentRow.push(null);
        }
        weeks.push(currentRow);
    }

    return weeks;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [userid, setUserid] = useState<string>('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [smalldiary, setsmallDiary] = useState<any[]>([]);
    const [coupleId, setCoupleId] = useState<string>('');
    const [couplediary, setCoupleDiary] = useState<any[]>([]);
    
    const actualToday = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    const calendarMatrix = generateCalender(year, month);

    // Navigation functions
    const goToPreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };
    
    const goToNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // API functions
    const getUserInfo = async () => {
        try {
            const storedUserInfo = await AsyncStorage.getItem("userInfo");
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserid(parsedUserInfo.id);
            }
        } catch (error) {
            console.error('Error getting user info:', error);
        }
    };

    const fetchCoupleId = async () => {
        try {
            const response = await apiClient.post('/home/coupleName', {
                user_id: userid
            });
            
            if (response.data.success) {
                setCoupleId(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching couple ID:', error);
            setCoupleId('');
        }
    };

    const fetchDiaries = async () => {
        try {
            const response = await apiClient.post('/home', {
                user_id: userid
            });
            
            if (response.data.success) {
                setsmallDiary(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching diaries:', error);
            setsmallDiary([]);
        }
    };

    const fetchCoupleDiary = async () => {
        try {
            const response = await apiClient.post('/home/couplediary', {
                user_id: userid
            });
            if (response.data.success) {
                setCoupleDiary(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching couple diary:', error);
            setCoupleDiary([]);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);
    
    useFocusEffect(
        React.useCallback(() => {
            if (userid) {
                fetchDiaries();
                fetchCoupleId();
                fetchCoupleDiary();
            }
        }, [userid])
    );

    return (
        <View style={styles.container}>
            <View style={styles.calendarContainer}>
                <View style={styles.ribbon}>
                    <View style={styles.ribbonEnd} />
                </View>
                
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.navButton} onPress={goToPreviousMonth}>
                        <Text style={styles.navText}>◀</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>{setMonthName(month)} {year}</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.todayButton}
                        onPress={goToToday}
                    >
                        <Text style={styles.todayButtonText}>Today</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
                        <Text style={styles.navText}>▶</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.weekdayRow}>
                    {weekdays.map((day, idx) => (
                        <View key={idx} style={[
                            styles.weekdayBox,
                            {backgroundColor: idx === 0 ? '#FFB5C0' : idx === 6 ? '#B5C4FF' : '#FFE5EC'}
                        ]}>
                            <Text style={[
                                styles.weekdayText,
                                {color: idx === 0 ? '#FF4D6A' : idx === 6 ? '#4D6AFF' : '#FF6699'}
                            ]}>
                                {day}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.calendarGrid}>
                    {calendarMatrix.map((week, rowIndex) => (
                        <View style={styles.row} key={rowIndex}>
                            {week.map((date, colIndex) => {
                                const isToday = 
                                    date === actualToday.getDate() && 
                                    month === actualToday.getMonth() && 
                                    year === actualToday.getFullYear();

                                const matchedDiary = smalldiary.find(item => {
                                    const d = new Date(item.diary_date);
                                    return (
                                        d.getFullYear() === year &&
                                        d.getMonth() === month &&
                                        d.getDate() === date
                                    );
                                });

                                const coupleDiary = couplediary.find(item => {
                                    const d = new Date(item.diary_date);
                                    return (
                                        d.getFullYear() === year &&
                                        d.getMonth() === month &&
                                        d.getDate() === date
                                    );
                                });

                                const emoteToday = setMyEmoteType(matchedDiary?.feeling);
                                const emoteCouple = setCoupleEmoteType(coupleDiary?.feeling);

                                return (
                                    <View 
                                        style={[
                                            styles.dateBox,
                                            isToday && styles.todayDateBox
                                        ]} 
                                        key={colIndex}
                                    >
                                        {date ? (
                                            <View style={styles.dateContent}>
                                                <Text style={[
                                                    styles.dateText,
                                                    colIndex === 0 ? styles.sundayText : 
                                                    colIndex === 6 ? styles.saturdayText : null
                                                ]}>
                                                    {date}
                                                </Text>
                                                
                                                <View style={styles.emoteContainer}>
                                                    {matchedDiary && (
                                                        <TouchableOpacity 
                                                            onPress={() => navigation.navigate('Detail', {
                                                                clickdate: date,
                                                                clickmonth: month,
                                                                clickyear: year,
                                                                userid: userid
                                                            })}
                                                            style={styles.emoteButton}
                                                        >
                                                            <Image 
                                                                source={emoteToday}
                                                                style={styles.emoteImage}
                                                                resizeMode="contain"
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                    
                                                    {coupleDiary && (
                                                        <TouchableOpacity 
                                                            onPress={() => navigation.navigate('Detail', {
                                                                clickdate: date,
                                                                clickmonth: month,
                                                                clickyear: year,
                                                                userid: coupleId
                                                            })}
                                                            style={styles.emoteButton}
                                                        >
                                                            <Image 
                                                                source={emoteCouple}
                                                                style={styles.emoteImage}
                                                                resizeMode="contain"
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        ) : (
                                            <View />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF5F7',
        paddingTop: 60,
    },
    calendarContainer: {
        width: '95%',
        flex: 0.92,
        marginTop: 25,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 20, // 위아래 여백 추가
        paddingHorizontal: 15, // 좌우 여백 추가
        padding: 15,
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#FFE5EC',
    },
    ribbon: {
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
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between', // 양쪽 정렬
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 15, // 통일된 하단 여백
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center', // 중앙 정렬
    },
    headerText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#FF6699',
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
        marginHorizontal: 5,
    },
    navText: {
        fontSize: 18,
        color: '#FF6699',
    },
    todayButton: {
        backgroundColor: '#FF9CB1',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FF8BA7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    todayButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    weekdayRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        //marginBottom: 10, // 통일된 하단 여백
    },
    weekdayBox: {
        width: '13%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD6EA',
        marginHorizontal: 2,
    },
    weekdayText: {
        fontSize: 14,
        fontWeight: '600',
    },
    calendarGrid: {
        flex: 1,
        marginTop: 10,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    dateBox: {
        width: '13%',
        aspectRatio: 0.45,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE5EC',
        padding: 4,
        marginHorizontal: 2,
        shadowColor: '#FFD6EA',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    dateContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 2,
    },
    dateText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
        marginBottom: 2,
    },
    emoteContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 1,
    },
    emoteButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FFE5EC',
        marginVertical: 1,
    },
    emoteImage: {
        width: 24,
        height: 24,
        borderRadius: 20,
    },
    todayDateBox: {
        backgroundColor: '#FFF5F7',
        borderColor: '#FF9CB1',
        borderWidth: 2,
        shadowColor: '#FFB6C1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    sundayText: {
        color: '#FF6666',
    },
    saturdayText: {
        color: '#6666FF',
    },
});

export default HomeScreen;