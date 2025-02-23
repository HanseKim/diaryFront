import { all } from "axios";
import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
type InfoComponentProps = {
  name: string;
  month_diary: number;
  all_diary: number;
  diarycount: { [key: number]: number };
  handleModal: (modal: number) => void;
  daysPassed: number;
};

const InfoComponent: React.FC<InfoComponentProps> = ({
  name,
  month_diary,
  all_diary,
  diarycount,
  handleModal,
  daysPassed
}) => {
  const mood = ['sad', 'angry', 'normal', 'smile', 'happy'];
  const moodImages: { [key: string]: any } = {
    sad: require("../images/myFace/sad.png"),
    angry: require("../images/myFace/angry.png"),
    normal: require("../images/myFace/normal.png"),
    smile: require("../images/myFace/smile.png"),
    happy: require("../images/myFace/happy.png"),
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.title}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.daysText}>
            {daysPassed !== -1 ? `D+${daysPassed}` : "D+???"}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleModal(1)}
        >
          <Text style={styles.editButtonText}>수정하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>한달동안 쓴 일기</Text>
          <Text style={styles.statValue}>{month_diary}개</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>총 일기</Text>
          <Text style={styles.statValue}>{all_diary}개</Text>
        </View>
      </View>

      <View style={styles.moodContainer}>
        <Text style={styles.moodTitle}>한달동안의 기분</Text>
        <View style={styles.moodGrid}>
          {mood.map((item, index) => (
            <View style={styles.moodItem} key={item}>
              <View style={styles.moodImageBox}>
                <Image source={moodImages[item]} style={styles.moodIcon} />
              </View>
              <Text style={styles.moodCount}>{diarycount[index + 1] || 0}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 300,
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFE5EC',
    shadowColor: '#FFB6C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FF6699',
    marginBottom: 4,
  },
  daysText: {
    fontSize: 15,
    color: '#FF9CB1',
  },
  editButton: {
    backgroundColor: '#FFE5EC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  editButtonText: {
    color: '#FF6699',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFE5EC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFB6C1',
  },
  deleteButtonText: {
    color: '#FF5C85',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#FFF5F7',
    padding: 10,
    borderRadius: 15,
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5EC',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6699',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5C85',
  },
  moodContainer: {
    flex: 1,
    padding: 10,
  },
  moodTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6699',
    marginBottom: 10,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  moodItem: {
    alignItems: 'center',
  },
  moodImageBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF5F7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#FFE5EC',
  },
  moodIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  moodCount: {
    fontSize: 14,
    color: '#FF6699',
    fontWeight: '500',
  },
});
export default InfoComponent;