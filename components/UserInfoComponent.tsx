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
  name : string
  month_diary: number
  all_diary:number
  diarycount : { [key: number]: number }
  handleModal : (modal:number) => void
  daysPassed: number,
}
const InfoComponent:React.FC<InfoComponentProps> = ({name,month_diary,all_diary,diarycount,handleModal,daysPassed}) => {
  const mood = ['sad','angry','normal','smile','happy'];
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
        <View style={{height: 50}}>
          <Text style={{
            fontSize: 25,
            fontWeight: 'bold',
          }}>{name}</Text>
          <Text style={{
            fontSize: 15, 
          }}>{daysPassed!==-1 ? `D+${daysPassed}` : "D+???"}</Text>
        </View>
        <View style={{height:30}}>
          <TouchableOpacity onPress={()=>handleModal(1)}>
            <Text style={{
              paddingTop: 10,
            }}>수정하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contents}>
          <Text style={styles.contentText}>한달동안 쓴 일기 : {month_diary}개</Text>
          <Text style={styles.contentText}>총 일기 : {all_diary}개</Text>
      </View>
      <View style={styles.moodcontainer}>
        <Text style={styles.contentText}>한달동안의 기분</Text>
        <View style={styles.imglist}>
          {mood.map((item, index) => (
            <View style={styles.facecontainer} key={item}>
              <Image source={moodImages[item]} style={styles.icons} />
              <Text>{diarycount[index + 1] || 0}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    width: 350,
    height: 300,
    marginTop: 15,
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
  title : {
    flex: 0.3,
    height: 50,
    margin: 10,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contents : {
    margin: 10,
    marginTop: 30,
  },
  contentText : {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  moodcontainer : {
    marginLeft: 10,
    marginRight: 10,
  },
  facecontainer:{
    marginRight: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imglist:{
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: "space-evenly"
  },
  icons : {
    width: 40,
    height: 40,
    resizeMode : "center",
    marginBottom: 5,
  }
})

export default InfoComponent;