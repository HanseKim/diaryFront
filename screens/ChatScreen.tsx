/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../contexts/appContext";
import { fetchChatList, fetchGroupId } from "../utils/apiClient";
import { useFocusEffect } from "@react-navigation/native";
import { refreshTriggerState } from '../store/recoilstate';
import { useRecoilValue } from "recoil";

const ChatScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error("AppContext must be used within an AppProvider");
  }


  const { messages, setMessages } = appContext;
  const [cnt, setCnt] = useState<number>(0);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [partner, setPartner] = useState<string>("");
  const refreshTrigger = useRecoilValue(refreshTriggerState);
  async function loadchat() {
    const isGroupResult = await fetchGroupId();
    if (isGroupResult) {
      setIsGroup(true);
      const stored_partner = await AsyncStorage.getItem("userInfo");
      setPartner(JSON.parse(String(stored_partner)).coupleName);
      const tmp = await AsyncStorage.getItem("chatdata");
      if (tmp) {

        setMessages(JSON.parse(tmp));
      } else {

      }
      


      const data = await fetchChatList();

      if (data["msg"].length > 0) {
        setMessages((prev) => [...prev, ...data['msg']]);
        setCnt(data["msg"].length);
      }
      else {
        setCnt(0);
      }
      
    }
  }

  
  
  useFocusEffect(
    React.useCallback(() => {
      
      loadchat();

    }, [])
  );

  useEffect(() => {
    loadchat();
  }, [refreshTrigger]);

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatCard}>
        <View style={styles.ribbon}>
          <View style={styles.ribbonEnd} />
        </View>
        
        {isGroup ? (
          <TouchableOpacity
            style={styles.chatRoomContainer}
            onPress={async () => {
              setMessages([]);
              const userid = await AsyncStorage.getItem("userid");
              const token = await AsyncStorage.getItem("jwtToken");
              const g_id = await AsyncStorage.getItem("groupid");
              navigation.navigate("Message", {
                token: token,
                groupid: g_id,
                userid: userid,
              });
            }}
          >
            <View style={styles.chatContent}>
              <View style={styles.chatDetails}>
                <Text style={styles.chatName}>{partner}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {messages.length > 0 ? messages[messages.length - 1]?.text : "No message"}
                </Text>
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.chatTime}>
                  {messages.length > 0 ? messages[messages.length - 1]?.date : ""}
                </Text>
                {cnt > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{cnt}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noCoupleContainer}>
            <Text style={styles.noCoupleText}>커플 연결이 필요합니다</Text>
          </View>
        )}
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
  chatCard: {
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
  chatRoomContainer: {
    width: '100%',
    marginBottom: 12,
  },
  chatContent: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6699',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#FF9CB1',
  },
  chatMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chatTime: {
    fontSize: 12,
    color: '#FF9CB1',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#FF9CB1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadCount: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  noCoupleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noCoupleText: {
    fontSize: 16,
    color: '#FF9CB1',
    fontWeight: '500',
  },
});

export default ChatScreen;