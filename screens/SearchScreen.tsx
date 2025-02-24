import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
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
          fetchDiaryData(parsedUser.id);
        }
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };

    getUserInfo();
  }, []);

  const handleSearch = () => {
    const results = diaryData.filter((diary) =>
      diary.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
  };

  const handleItemPress = (item: DiaryEntry) => {
    navigation.navigate('Home', {
      screen: 'Detail',
      params: {
        clickdate: parseInt(item.diary_date.split('-')[2], 10),
        clickmonth: parseInt(item.diary_date.split('-')[1], 10) - 1,
        clickyear: parseInt(item.diary_date.split('-')[0], 10),
        userid: user_id,
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDiaryData(user_id);
    }, [user_id])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchCard}>
        <View style={styles.ribbon}>
          <View style={styles.ribbonEnd} />
        </View>
        
        {/* 검색 입력창 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색할 일기의 제목을 입력하세요"
            placeholderTextColor="#FF9CB1"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Image
              source={require('../images/Search.png')}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        <FlatList
          style={styles.resultsList}
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
                <View style={styles.textContainer}>
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
    backgroundColor: '#FFF5F7',
    paddingTop: 60,
    alignItems: 'center',
  },
  searchCard: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5EC',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#FF6699',
  },
  searchButton: {
    backgroundColor: '#FF9CB1',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF8BA7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  resultsList: {
    width: '100%',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultContent: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5EC',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resultMood: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  resultDate: {
    fontSize: 14,
    color: '#FF9CB1',
    marginBottom: 4,
  },
  resultHeadline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6699',
  },
});

export default SearchScreen;