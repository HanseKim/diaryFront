import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  SafeAreaView,
} from "react-native";
import { io } from "socket.io-client";
import { AppContext } from "../contexts/appContext";
import moment from 'moment';
import { useFocusEffect } from "@react-navigation/native";
import KeyboardAvoidComponent from "../components/KeyboardAvoidComponent";

type MessageProp = {
  id: string; user: string; text: string, date: string;
}

const MessageScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

  const [message, setMessage] = useState<string>("");
  //const [messages, setMessages] = useState<MessageProp[]>([]);
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { messages, setMessages } = appContext;

  const { token, groupid, userid } = route.params;

  const socket = io("http://203.245.30.195:3000/", {
    auth: {
      token, // 서버로 토큰 전달
    },
  });

  const joinRoom = () => {
    socket.emit("joinRoom", (groupid));

  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", (groupid)); // 서버에 Room leave 요청

  };



  const flatListRef = useRef<FlatList<MessageProp>>(null); // FlatList 참조 생성

  // 메시지 상태 변경 시 자동 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  socket.on("new msg arrive", (data, uid) => {
    if (uid === userid) {

    }
    else {
      setMessages((prev) => [...prev, data]);
    }
  });

  socket.on("new msg set", (data, uid) => {

    if (uid === userid) {
    }
    else {
      setMessages((prev) => [...prev, ...data]);
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      async function loadchat() {
        const tmp = await AsyncStorage.getItem("chatdata");
        if (tmp) {

          setMessages(JSON.parse(tmp));
        } else {

        }
      }
      loadchat();
    }, [])
  );

  useEffect(() => {

    joinRoom();

    return () => {

      leaveRoom();
      socket.disconnect();
    }
  }, [])


  useEffect(() => {
    const saveMessagesToStorage = async () => {
      try {
        const jsonValue = JSON.stringify(messages);
        await AsyncStorage.setItem("chatdata", jsonValue);

      } catch (error) {

      }
    };

    if (messages.length > 0) {
      saveMessagesToStorage();
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim()) {
      const now = moment();
      const newMessage = { id: Date.now().toString(), user: userid, text: message, date: now.format('YY-MM-DD HH:mm') };
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      const info = JSON.parse(String(storedUserInfo)).nickname;
      socket.emit("new message", newMessage, groupid, info); // 메시지 서버로 전송
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage("");
    }
  };

  const renderMessage = (item: MessageProp, index: number) => (
    <View style={[styles.messageContainer, item.user == userid ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" }]}>
      <Text style={[styles.messageText]}>{item.text}</Text>
    </View>
  );

  return ( //SafeAreaView
    <SafeAreaView  style={styles.container}>
      <KeyboardAvoidComponent>
        <View style={styles.messageCard}>
          <View style={styles.ribbon}>
            <View style={styles.ribbonEnd} />
          </View>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[
                styles.messageContainer,
                item.user == userid 
                  ? styles.sentMessage
                  : styles.receivedMessage
              ]}>
                <View style={styles.messageContent}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.messageTime}>{item.date}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#FF9CB1"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidComponent>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    paddingTop: 20,
  },
  messageCard: {
    flex: 1,
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFE5EC',
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
    zIndex: 1,
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
  chatList: {
    padding: 10,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE5EC',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    color: '#FF6699',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#FF9CB1',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#FFE5EC',
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5F7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5EC',
    color: '#FF6699',
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF9CB1',
    borderRadius: 20,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MessageScreen;