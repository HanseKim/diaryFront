/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient, fetchGroupId } from '../utils/apiClient';
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


function generateCalender(year: number, month: number){
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month+1, 0).getDate();

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

const setMonthName = (month: number) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
}

const setMyEmoteType = (emote: number) => {
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
const setCoupleEmoteType = (emote: number) => {
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

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const HomeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [userid, setUserid] = useState<string>('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const actualToday = new Date()
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const [smalldiary, setsmallDiary] = useState<any[]>([]);
    const [coupleName, setCoupleName] = useState<string>('');
    const [couplediary, setCoupleDiary] = useState<any[]>([]);
    
    const calendarMatrix = generateCalender(year, month);
    const monthName = setMonthName(month);
    const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보 상태 추가

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };
    const goToToday = () => {
        setCurrentDate(new Date());
    };
    const getUserInfo = async () => {
        try { 
            const storedUserInfo = await AsyncStorage.getItem("userInfo");
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
                setUserid(parsedUserInfo.id); // userInfo에서 id를 설정
                console.log("User ID: ", parsedUserInfo.id);
            }
        } catch (error) {
            console.error("Error retrieving user info:", error);
        }
    };
    async function fetchCoupleId() {
        try {
            const storedUserInfo = await AsyncStorage.getItem("userInfo");
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserid(parsedUserInfo.id);
            }
            
            const response = await apiClient.post(`/home/coupleName`, {
                user_id: userid
            });
            
            if (response.data.success) {
                console.log("Couple data received:", response.data.data);
                setCoupleName(response.data.data);
            } else {
                console.error('API error:', response.data);
                setCoupleName('');
            }
        }
        catch (error) {
            console.error('Fetch error:', error);
            setCoupleName('');
        }
    }
    async function fetchUsers() {
        try {
            const storedUserInfo = await AsyncStorage.getItem("userInfo");
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserid(parsedUserInfo.id);
            }
            
            const response = await apiClient.post(`/home`, {
                user_id: userid
            });
            
            if (response.data.success) {
                console.log("Diary data received:", response.data.data);
                setsmallDiary(response.data.data);
            } else {
                console.error('API error:', response.data);
                setsmallDiary([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setsmallDiary([]);
        }
    }
    const fetchCoupleDiary = async () => {
        try {
            const response = await apiClient.post(`/home/couplediary`, {
                user_id: userid
            });
            if (response.data.success) {
                console.log("Diary data received:", response.data.data);
                setCoupleDiary(response.data.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setCoupleDiary([]);
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []); // 처음 한 번만 실행
    
    useFocusEffect(
        React.useCallback(() =>  {
            if (userid) {  // userid가 있을 때만 실행
                fetchUsers();
                fetchCoupleId();
                fetchCoupleDiary();
            }
        }, [userid]) // userid 변경 시에만 실행
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
            <Image source={require('../images/logo.png')} style={{ width: '100%', height: '10%', marginTop:50}} />
            <View style={{ paddingTop:'3%', width: '100%',flex:1,  alignItems: 'center', backgroundColor: '#FADFEC', marginTop: '5%', borderRadius: 10, shadowOffset: { width: 0, height: 2 }, shadowColor: '#F5BFD9', shadowOpacity: 0.5, shadowRadius: 2 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{monthName} {year}</Text>
                    <TouchableOpacity onPress={goToPreviousMonth} style={{}}>
                        <Text style={{}}>◀</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={goToToday}
                        style={styles.todayButton}
                    >
                        <Text style={styles.todayButtonText}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToNextMonth} style={{}}>
                        <Text style={{}}>▶</Text>
                    </TouchableOpacity>
                </View>

                <View style={{width: '100%', height: '5%', flexDirection: 'row', justifyContent: 'center'}}>
                    {weekdays.map((day, idx) => {
                        const backgroundColor = idx === 0 ? '#FF6161' : idx === 6 ? '#718FF3' : '#333';
                        return (
                            <View key={idx} style={[styles.weekdayBox, { backgroundColor }]}>
                                <Text style={styles.weekdayText}>{day}</Text>
                            </View>
                        );
                    })}
                </View>

                {calendarMatrix.map((week, rowIndex) => (
                    <View style={styles.row} key={rowIndex}>
                        {week.map((date, colIndex) => {
                            const textColor = colIndex === 0 ? '#FF6161' : colIndex === 6 ? '#718FF3' : 'black';
                            
                            const borderColor = (
                                date === actualToday.getDate() && 
                                month === actualToday.getMonth() && 
                                year === actualToday.getFullYear()
                            ) ? '#F5BFD9' : 'white';
                
                            let matchedDiary = smalldiary?.find((item: { diary_date: string | number | Date; }) => {
                                const d = new Date(item.diary_date);
                                return (
                                    d.getFullYear() === year &&
                                    d.getMonth() === month &&
                                    d.getDate() === date
                                );
                            });
                            let coupleDiary = couplediary?.find((item: { diary_date: string | number | Date; }) => {
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
                                <View style={[styles.dateBox, {borderColor: borderColor, borderWidth: 4}]} key={colIndex}>
                                    {date ? (
                                        <View style={{height:'100%'}}
                                            // key={colIndex}
                                            >
                                            <Text style={[styles.dateText, { color: textColor}]}>
                                                {date}
                                            </Text>
                                            <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-around', alignItems:'center'}}>
                                            {matchedDiary ? (
                                                <>
                                                    <TouchableOpacity 
                                                        onPress={() => navigation.navigate('Detail', {
                                                            clickdate: date, 
                                                            clickmonth: month, 
                                                            clickyear: year, 
                                                            userid : userid
                                                        })} 
                                                        style={{flex:0.4, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Image 
                                                            source={emoteToday} 
                                                            style={{width: 30, height: 30}}
                                                            resizeMode="contain"
                                                        />
                                                    </TouchableOpacity>
                                                </> 
                                            ) : (
                                                <View style={{flex:0.4}}/>
                                            )}
                                            {coupleDiary ? (
                                                <>
                                                    <TouchableOpacity 
                                                        onPress={() => navigation.navigate('Detail', {
                                                            clickdate: date, 
                                                            clickmonth: month, 
                                                            clickyear: year, 
                                                            userid : coupleName
                                                        })} 
                                                        style={{flex:0.4, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Image 
                                                            source={emoteCouple} 
                                                            style={{width: 30, height: 30}}
                                                            resizeMode="contain"
                                                        />
                                                    </TouchableOpacity>
                                                </> 
                                            ) : (
                                                <View style={{flex:0.4}}/>
                                            )}
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={styles.dateText}/>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
      );
};

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#FADFEC',
        width: '98%',
        height: '10%',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 30,
        fontFamily: 'Manrope'
    },
    todayButton: {
        backgroundColor: '#F5BFD9',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    todayButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Manrope',
    },
    row: {
        width: '100%',
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'center',
    },
    weekdayBox: {
        borderRadius: 5,
        width: '12%',
        height: '90%',
        marginRight: '1%',
        marginLeft: '1%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekdayText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Manrope'
    },
    dateBox: {
        backgroundColor: 'white',
        marginRight: '1%',
        marginLeft: '1%',
        width: '12%',
        height: '90%',
        borderRadius: 5,
    },
    dateText: {
        width: '50%',
        borderRadius: 3,
        fontSize: 14,
        fontFamily: 'Manrope',
        backgroundColor: "white"
    },
});

export default HomeScreen;