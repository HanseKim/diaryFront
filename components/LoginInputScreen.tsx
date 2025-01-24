import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
} from 'react-native';

type LoginInputScreenProps = {
  onLogin: (id: string, password: string) => void, 
  goRegister: () => void;
  style: any 
}

const LoginInputScreen: React.FC<LoginInputScreenProps> = ({ onLogin, goRegister, style }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 비밀번호 유효성 검사
    if (password.length < 4) {
      Alert.alert("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }

    // 서버에 로그인 요청 (비밀번호 해싱은 서버에서 처리)
    onLogin(id, password); // 여기에 실제 로그인 로직을 추가해야 합니다.
  };

  return (
    <View style={style}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>로그인</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="아이디"
            placeholderTextColor="#F5BFD9"
            value={id}
            onChangeText={setId}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#F5BFD9"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <View style={{
        flexDirection: 'row',
        height: 150,
        marginBottom: 20,
      }}>
        <View style={styles.registerText}>
          <Text style={{
            color: 'white',
            fontSize: 17,
          }}>계정이 없으신가요? </Text>
          <View style={{width:80,marginLeft: 40,marginRight: 100,}}>
            <TouchableOpacity onPress={goRegister}>
              <Text style={{
                width:80,
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height:60, marginTop: 20}}>
          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.loginbtn}>
              <Text style={{ color: 'white' }}>로그인</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    width: 300,
  },
  subtitle: {
    width: 300,
    fontSize: 36,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#FF5C85',
  },
  inputContainer: {
    marginBottom: 25,
    borderRadius: 8,
    shadowColor: '#FF5C85',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#FF5C85',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  registerText: {
    width: 250,
    marginTop: 100,
    flexDirection: 'column',
  },
  loginbtn: {
    width: 120,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBADC1',
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  }
});

export default LoginInputScreen;
