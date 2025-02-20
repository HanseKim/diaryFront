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
} from "react-native";
import { io } from "socket.io-client";
import { AppContext } from "../contexts/appContext";
import moment from 'moment';
import { useFocusEffect } from "@react-navigation/native";

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

  const socket = io("http://10.0.2.2:80/", {
    auth: {
      token, // 서버로 토큰 전달
    },
  });

  const joinRoom = () => {
    socket.emit("joinRoom", (groupid));
    console.log("joined room : ", groupid);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", (groupid)); // 서버에 Room leave 요청
    console.log("leave Room");
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
    console.log("from chat data : ", data);
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
          //console.log(tmp);
          setMessages(JSON.parse(tmp));
        } else {
          console.log("empty");
        }
      }
      loadchat();
    }, [])
  );

  useEffect(() => {

    joinRoom();

    return () => {
      //console.log("socket disconnected");
      leaveRoom();
      socket.disconnect();
    }
  }, [])


  useEffect(() => {
    const saveMessagesToStorage = async () => {
      try {
        const jsonValue = JSON.stringify(messages);
        await AsyncStorage.setItem("chatdata", jsonValue);
        //console.log("Messages saved to AsyncStorage:", jsonValue);
      } catch (error) {
        console.error("Error saving messages to AsyncStorage:", error);
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        {/* 채팅 메시지 리스트 */}
        <FlatList
          ref={flatListRef} // FlatList에 ref 연결
          data={messages} // messages 배열을 전달
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => renderMessage(item, index)}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })} // 콘텐츠 크기 변경 시 스크롤
        />

        {/* 입력창 및 전송 버튼 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatList: {
    padding: 10,
    flex: 18, // 채팅 리스트가 화면 전체를 사용하도록 설정
    justifyContent: "flex-end", // 채팅이 아래에서 시작되도록 정렬
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F5BFD9",
    shadowColor: "#F5BFD9",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  messageText: {
    fontWeight: '100',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#F5BFD9",
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F5BFD9",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MessageScreen;