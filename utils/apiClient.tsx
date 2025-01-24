import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: "http://10.0.2.2:80/", // 안드로이드 에뮬레이터용
  //baseURL: "http://127.0.0.1:80/", //IOS 에뮬레이터용
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchChatList = async (g : string) => {
  try {
    const response = await apiClient.post("/chat/list", {group_id : g});
    const res = response.data; 
    return res;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
};

export const fetchGroupId = async () => {
  try {
    const response = await apiClient.post("/chat/findGroup");
    const res = response.data; 
    await AsyncStorage.setItem("gid", res["result"]);
    return res;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
};

// JWT 토큰을 헤더에 설정
export const setAuthToken = async () => {
  const token = await AsyncStorage.getItem("jwtToken"); // JWT 토큰을 AsyncStorage에서 가져옴
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

apiClient.interceptors.request.use(async (config) => {
  await setAuthToken(); // 토큰 설정
  return config;
}, (error) => Promise.reject(error));

export const login = async (id: string, password: string) => {
  try {
    const response = await apiClient.post("/login", { id, password });
    console.log("Server Response:", response.data); // 서버 응답 확인

    const { token, user } = response.data;

    if (!user) {
      throw new Error("User object is missing in the server response.");
    }

    await AsyncStorage.setItem("jwtToken", token);
    await AsyncStorage.setItem("userInfo", JSON.stringify(user));
    await setAuthToken();

    console.log("Diary Counts : ", user.diaryCounts);
    console.log("CoupleCounts : ", user.coupleCounts);
    return user;
  } catch (error: any) {
    if (error.response) {
      console.error("Login error response:", error.response.data);
      if (error.response.status === 401) {
        throw { status: error.response.status, message: "비밀번호가 일치하지 않습니다." };
      } else if (error.response.status === 404) {
        throw { status: error.response.status, message: "해당 아이디의 유저가 없습니다." };
      }
    } else {
      console.error("Login error:", error.message);
    }
  }
};


// 기본 사용법
export const fetchData = async () => {
  const response = await apiClient.get("/protected-route");
  return response.data;
};

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error') {
      console.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
    }
    return Promise.reject(error);
  }
);
