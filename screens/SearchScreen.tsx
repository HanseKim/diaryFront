import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DiaryEntry {
  id: string;
  title: string;
  diary_date: string;
  feeling: number;
  content: string;
}

const feelingMap: { [key: number]: string } = {
  1: '😞',
  2: '😠',
  3: '😐',
  4: '😊',
  5: '😄',
};

const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [diaryData, setDiaryData] = useState<DiaryEntry[]>([]);
  const [filteredResults, setFilteredResults] = useState<DiaryEntry[]>([]);

  // 서버에서 일기 데이터를 가져오는 함수
  const fetchDiaryData = async () => {
    try {
      const user = await AsyncStorage.getItem('userInfo');
      if(user){
        const user_id = JSON.parse(user).id;
        const response = await axios.get(`http://10.0.2.2:80/api/diary?user_id=${user_id}`);
        setDiaryData(response.data);
      }
    } catch (error) {
      console.error('Error fetching diary data:', error);
    }
  };

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    const results = diaryData.filter((diary) =>
        diary.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
  };

  useEffect(() => {
    fetchDiaryData();
  }, []);

  // 검색된 아이템 클릭 시 상세 화면으로 이동
  const handleItemPress = (item: DiaryEntry) => {
    navigation.navigate('Detail', {
      // 년, 월 , 일 넘겨주기
      id: item.id,
    });
  };

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
            <Icon name="search" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        <View style={{ width: "100%", alignItems: 'center' }}>
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.resultContainer}
                    onPress={() => handleItemPress(item)}
                >
                  <View style={styles.resultContent}>
                    <Text style={styles.resultMood}>{feelingMap[item.feeling]}</Text>
                    <View>
                      <Text style={styles.resultDate}>{item.diary_date}</Text>
                      <Text style={styles.resultHeadline}>{item.title}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
            )}
          />
        </View>
        
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  searchContainer: {
    width: 350,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    width: 350,
    backgroundColor: '#FFF',
    padding: 15,
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
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultMood: {
    fontSize: 24,
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
