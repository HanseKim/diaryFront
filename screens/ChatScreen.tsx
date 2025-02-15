/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../contexts/appContext";
import { fetchChatList, fetchGroupId, fetchCoupleCheck } from "../utils/apiClient";
import { useFocusEffect } from "@react-navigation/native";

type MessageProp = {
  id: string; user: string; text: string, date: string;
}

const ChatScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error("AppContext must be used within an AppProvider");
  }


  const { messages, setMessages } = appContext;
  const [chats, setChats] = useState<MessageProp[]>([{ id: '', user: '', text: '', date: '' }]);
  const [cnt, setCnt] = useState<number>(0);
  const [gid, setGid] = useState<string>("");
  const [isGroup, setIsGroup] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      async function loadchat() {
        const isGroupResult = await fetchGroupId();
        if (isGroupResult) {
          setIsGroup(true);
          const group_id = await AsyncStorage.getItem("groupid");
          if (group_id !== null) {
            setGid(group_id);
          }
          const tmp = await AsyncStorage.getItem("chatdata");
          if (tmp) {
            console.log(tmp);
            setMessages(JSON.parse(tmp));
          } else {
            console.log("empty");
          }
          console.log("try fetch chat list");
  
          const data = await fetchChatList();
          console.log(data);
          if (data["msg"].length > 0) {
            setMessages((prev) => [...prev, data['msg']]);
            setCnt(data["msg"].length);
            //removeChat;
          }
          else {
            setCnt(0);
          }
        }
      }
      loadchat();
    }, [])
  );

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
              <Text style={styles.chatName}>여자친구</Text>
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