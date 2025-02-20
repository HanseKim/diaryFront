import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,  // ScrollView 제거하고 FlatList만 사용
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '../utils/apiClient';

interface DiaryEntry {
  id: string;
  title: string;
  diary_date: string;
  feeling: number;
  content: string;
}

const feelingMap: { [key: number]: any } = {
  1: require('../images/myFace/angry.png'),
  2: require('../images/myFace/sad.png'),
  3: require('../images/myFace/normal.png'),
  4: require('../images/myFace/smile.png'),
  5: require('../images/myFace/happy.png'),
};

const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [diaryData, setDiaryData] = useState<DiaryEntry[]>([]);
  const [filteredResults, setFilteredResults] = useState<DiaryEntry[]>([]);
  const [user_id, setUser_id] = useState<string>('');

  // 서버에서 일기 데이터를 가져오는 함수
  const fetchDiaryData = async (userId: string) => {
    try {
      const response = await apiClient.post(`/diary/search-diary`, {
        user_id: userId
      });
      const data = response.data;
      if (data) {
        const sortedData = data.sort((a: DiaryEntry, b: DiaryEntry) => 
          new Date(b.diary_date).getTime() - new Date(a.diary_date).getTime()
        );
        setDiaryData(sortedData);
        setFilteredResults(sortedData); 
      } else {
        console.error('Error fetching diary data:', data);
      }
    } catch (error) {
      console.error('Error fetching diary data:', error);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await AsyncStorage.getItem('userInfo');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUser_id(parsedUser.id);
          fetchDiaryData(parsedUser.id); // user_id가 설정된 후에 요청을 보냅니다.
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    const results = diaryData.filter((diary) =>
      diary.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
  };

  // 검색된 아이템 클릭 시 상세 화면으로 이동
  const handleItemPress = (item: DiaryEntry) => {
    navigation.navigate('Detail', {
      clickdate: parseInt(item.diary_date.split('-')[2], 10),
      clickmonth: parseInt(item.diary_date.split('-')[1], 10) - 1,
      clickyear: parseInt(item.diary_date.split('-')[0], 10),
      userid: user_id,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDiaryData(user_id);
    }, [user_id])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색 입력창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색할 일기의 제목을 입력하세요"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Image
            source={require('../images/Search.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>

      {/* 검색 결과 */}
      <FlatList
        style={{width:"100%"}}
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultContainer}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.resultContent}>
            <Image 
              source={feelingMap[item.feeling]} 
              style={styles.resultMood}
              resizeMode="contain"
            />
              <View>
                <Text style={styles.resultDate}>{item.diary_date}</Text>
                <Text style={styles.resultHeadline}>{item.title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: 'center',
  },
  searchContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#FF5C85',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: '#F6A5C0',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    width: "100%",
    alignItems: 'center'
  },
  resultContent: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#FF5C85',
    shadowOffset: {
      width: 10,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  resultMood: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  resultDate: {
    fontSize: 14,
    color: '#888',
  },
  resultHeadline: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
