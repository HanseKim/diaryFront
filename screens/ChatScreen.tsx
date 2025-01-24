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
import { fetchChatList, fetchGroupId } from "../utils/apiClient";
import { Axios } from "axios";

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
  useEffect(() => {
    async function loadchat() {
      fetchGroupId;
      const t = await AsyncStorage.getItem("gid");
      if (t !== null) {
        setGid(t);
      }
      const tmp = await AsyncStorage.getItem("chatdata");
      if (tmp) {
        console.log(tmp);
        setChats(JSON.parse(tmp));
        setMessages(JSON.parse(tmp));
      } else {
        console.log("empty");
      }
      console.log(chats);



      const data = await fetchChatList(gid);
      console.log(data);
      if (data["msg"].length > 0) {
        setChats(data["msg"]);
        setCnt(data["msg"].length);
      }
      else {
        setCnt(0);
      }
      console.log(chats);
      
    }

    loadchat();
    
  }, []);
  


  return (
    <View style={styles.container}>
      {
        <TouchableOpacity
          style={styles.chatRoomContainer}
          onPress={async () => {
            const userid = await AsyncStorage.getItem("userInfo");
            const token = await AsyncStorage.getItem("jwtToken");
            navigation.navigate("Message", {
              token: token,
              groupid: gid,
              userid : userid,
            })
          }}>
          {/* <Image source={{ uri: '' }} style={styles.avatar} /> */}
          <View style={styles.chatDetails}>
            <Text style={styles.chatName}>여자친구</Text>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {chats.length > 0 ? chats[chats.length-1]?.text : "No message"}
            </Text>
          </View>
          <View style={styles.chatMeta}>
            <Text style={styles.chatTime}>{chats.length > 0 ? chats[chats.length-1]?.date : ""}</Text>
            {cnt > 0 && (
              <Text style={styles.unreadCount}>{cnt}</Text>
            )}
          </View>
        </TouchableOpacity>
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
    borderColor: 'white',
    borderWidth: 1,
    shadowColor: "#F5BFD9",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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