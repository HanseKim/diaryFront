import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import { AppContext } from "../contexts/appContext";
import { Alert } from "react-native";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: "http://10.0.2.2:80/", // 안드로이드 에뮬레이터용
  //baseURL: "http://127.0.0.1:80/", //IOS 에뮬레이터용
  //baseURL : "https://203.245.30.195/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchChatList = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken"); // 저장된 토큰 가져오기
    const gid = await AsyncStorage.getItem("groupid");
    if (!token) throw new Error("No token found");

    const response = await apiClient.post("/chat/list",
      { group_id: gid },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post("/refresh/auth");
    Alert.alert(String(response.status));
    if (response.status === 200) {
      const newToken = response.data.token;
      await AsyncStorage.setItem("jwtToken", newToken);
      console.log("토큰이 성공적으로 갱신되었습니다.");
    }
  } catch (error) {
    Alert.alert('재로그인 해주시기 바랍니다.');
    console.error("토큰 갱신 실패:", error);
  }
};

export const fetchGroupId = async () => {
  try {

    const response = await apiClient.post(
      "/chat/findGroup",
    );

    const res = response.data;
    if (res['success']) {
      await AsyncStorage.setItem("groupid", JSON.stringify(res["result"]));
      return true;
    }
    else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching group ID:", error);

    return false;
  }
};

// JWT 토큰을 헤더에 설정
export const setAuthToken = async () => {
  const token = await AsyncStorage.getItem("jwtToken"); // JWT 토큰을 AsyncStorage에서 가져옴
  return `Bearer ${token}`;
};

apiClient.interceptors.request.use(async (config) => {
  const token = await setAuthToken(); // 토큰 설정
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => Promise.reject(error));


export const login = async (id: string, password: string) => {
  try {
    const response = await apiClient.post("/login", { id, password });
    console.log("Server Response:", response.data);

    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error("Token or user object is missing in the server response.");
    }

    await AsyncStorage.setItem("jwtToken", token);
    await AsyncStorage.setItem("userid", id);
    await AsyncStorage.setItem("userpwd", password);
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));

    console.log("Diary Counts : ", user.diaryCounts);
    console.log("CoupleCounts : ", user.coupleCounts);
    return user;
  } catch (error: any) {
    console.error("Login error:", error.message);

    // 서버 오류에 대한 처리
    if (error.response) {
      if (error.response.status === 401) {
        throw { status: error.response.status, message: "비밀번호가 일치하지 않습니다." };
      } else if (error.response.status === 404) {
        throw { status: error.response.status, message: "해당 아이디의 유저가 없습니다." };
      }
    }

    throw new Error("로그인 과정에서 문제가 발생했습니다.");
  }
};



// 기본 사용법
export const fetchData = async () => {
  const response = await apiClient.get("/protected-route");
  return response.data;
};


export const setFcm = async (fcm_token: string) => {
  try {
    const response = await apiClient.post("/login/save-fcm-token", { fcm_token });
    console.log("Server Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.message);

    // 서버 오류에 대한 처리
    if (error.response) {
      if (error.response.status === 401) {
        //Alert.alert("비밀번호가 일치하지 않습니다.");
        throw { status: error.response.status, message: "비밀번호가 일치하지 않습니다." };
      } else if (error.response.status === 404) {
        //Alert.alert("해당 아이디의 유저가 없습니다.");
        throw { status: error.response.status, message: "해당 아이디의 유저가 없습니다." };
      }
    }

    throw new Error("로그인 과정에서 문제가 발생했습니다.");
  }
};


axios.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error') {
      Alert.alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
      console.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
    }
    return Promise.reject(error);
  }
);