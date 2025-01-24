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

const setEmoteType = (emote: number) => {
    const emoteList = ['😊', '😥', '😡', '😭', '🤣'];
    return emoteList[emote-1];
}
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const HomeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [userid, setUserid] = useState('ttt');
    const now = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const [smalldiary, setsmallDiary] = useState<any[]>([]);
    
    const calendarMatrix = generateCalender(year, month);
    const monthName = setMonthName(month);
    const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보 상태 추가

    const getUserInfo = async () => {
    try { 
          const storedUserInfo = await AsyncStorage.getItem("userInfo");
          if (storedUserInfo) {
              const parsedUserInfo = JSON.parse(storedUserInfo);
              setUserInfo(parsedUserInfo);
              setUserid(parsedUserInfo.id); // userInfo에서 id를 설정
          }
      } catch (error) {
          console.error("Error retrieving user info:", error);
      }
    };

    
    async function fetchUsers(userId: string) {
      console.log("Fetching for userId:", userId); // 확인 로그
      try {
          const response = await fetch(`http://10.0.2.2:80/Home`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  user_id: "Test",
              }),
          });
          const json = await response.json();
          if (json.success) {
              console.log("Diary data received:", json.data); // 데이터 확인
              setsmallDiary(json.data);
          } else {
              console.error('API error:', json);
              setsmallDiary([]);
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
  }  
    useEffect(() => {
        getUserInfo();
        fetchUsers(userid);
    },[])

    return (
        < >
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
            <Image source={require('../images/logo.png')} style={{ width: '100%', height: '10%' }} />
        
        <View style={{ paddingTop:'3%', width: '100%', alignItems: 'center', backgroundColor: '#FADFEC', marginTop: '5%', borderRadius: 10, shadowOffset: { width: 0, height: 2 }, shadowColor: '#F5BFD9', shadowOpacity: 0.5, shadowRadius: 2 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{monthName} {year}</Text>
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
                        
                        const borderColor = date === now ? '#F5BFD9' : 'white';
                        let matchedDiary = smalldiary?.find((item: { diary_date: string | number | Date; }) => {
                            const d = new Date(item.diary_date);
                            return (
                              d.getFullYear() === year &&
                              d.getMonth() === month &&
                              d.getDate() === date
                            );
                          });
                          const emoteToday = setEmoteType(matchedDiary?.feeling);
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('Detail', {clickdate: date, clickmonth: month, clickyear: year, userid : userid})} 
                            style={[styles.dateBox, {borderColor: borderColor, borderWidth: 4}]} key={colIndex}>
                                {date ? (
                                    <>
                                    <Text style={[styles.dateText, { color: textColor}]}>
                                    {date}
                                    </Text>
                                    {matchedDiary ? (
                                        <>
                                        <Text>
                                            {emoteToday}
                                        </Text>
                                        <Text>
                                            {matchedDiary?.title}
                                        </Text></>
                                    ) : (
                                        <Text> </Text>
                                    )}
                                    </>
                                ) : (
                                    <Text style={styles.dateText}> </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
        </View>
        </>
      );
};

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 16,
        backgroundColor: '#FADFEC',
        width: '98%',
        height: '10%',
        borderRadius: 10,
      },
      headerText: {
        fontSize: 30,
        fontFamily: 'Manrope'
      },
      row: {
        width: '100%',
        height: '15%',
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
        width: '40%',
        borderRadius: 3,
        fontSize: 14,
        fontFamily: 'Manrope',
        backgroundColor: "white"
      },
});

export default HomeScreen;