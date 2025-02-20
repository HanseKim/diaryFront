import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Alert } from "react-native";
import { refreshToken } from "./apiClient";

// JWT 디코딩 함수 (Base64 디코딩)
const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split(".")[1]; // JWT의 Payload 부분
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        return null;
    }
};


const TOKEN_REFRESH_TIME = 10 * 60 * 1000; // 10분 (밀리초)

// ✅ 토큰 만료 10분 전에 자동으로 재발급하는 함수
const checkAndRefreshToken = async () => {
    try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
            return;
        }

        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return;

        const expTime = decoded.exp * 1000; // UNIX Timestamp 변환
        const now = Date.now();
        const timeLeft = expTime - now;

        if (timeLeft < TOKEN_REFRESH_TIME) {
            //console.log("토큰 만료 10분 전! 새로운 토큰을 요청합니다.");
            await refreshToken(); // 새 토큰 요청
        }
    } catch (error) {
        console.error("토큰 체크 오류:", error);
    }
};

// ✅ 새 토큰 요청 함수


// ✅ 앱 실행 시 토큰 체크
export const useTokenRefresh = () => {
    useEffect(() => {
        checkAndRefreshToken();
        //Alert.alert("check token");
        const interval = setInterval(checkAndRefreshToken, 5 * 60 *1000); // 5분마다 체크
        return () => clearInterval(interval); // 언마운트 시 클리어
    }, []);
};