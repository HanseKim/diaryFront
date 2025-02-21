/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
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
    <View style={styles.container}>
      {isGroup ?
        (
          <TouchableOpacity
            style={styles.chatRoomContainer}
            onPress={async () => {
              setMessages([]);
              const userid = await AsyncStorage.getItem("userid");
              const token = await AsyncStorage.getItem("jwtToken");
              const g_id = await AsyncStorage.getItem("groupid")
              navigation.navigate("Message", {
                token: token,
                groupid: g_id,
                userid: userid,
              })
            }}>
            {/* <Image source={{ uri: '' }} style={styles.avatar} /> */}
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{partner}</Text>
              <Text style={styles.chatMessage} numberOfLines={1}>
                {messages.length > 0 ? messages[messages.length - 1]?.text : "No message"}
              </Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{messages.length > 0 ? messages[messages.length - 1]?.date : ""}</Text>
              {cnt > 0 && (
                <Text style={styles.unreadCount}>{cnt}</Text>
              )}
            </View>
          </TouchableOpacity>
        )
        : (
          <Text>not couple</Text>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
  },
  chatRoomContainer: {
    borderRadius: 8,
    borderColor: '#F5BFD9',
    borderWidth: 1,
    shadowColor: "#F5BFD9",
    shadowOffset: {
      width: 13,
      height: 13,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    margin: 5,
    backgroundColor: "#fff",
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
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
  },
  chatMessage: {
    fontSize: 14,
    color: "#555",
  },
  chatMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  unreadCount: {
    fontSize: 12,
    color: "#F5BFD9",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default ChatScreen;