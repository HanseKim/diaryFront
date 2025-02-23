import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

type RegisterInputScreenProps = {
  handleRegister: (nickname: string, id: string, password: string) => void;
  goLogin: () => void;
  style?: any;
}

const RegisterInputScreen: React.FC<RegisterInputScreenProps> = ({ handleRegister, goLogin, style }) => {
  const [nickname, setNickname] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegisterBtn = () => {
    if (password.length < 4) {
      Alert.alert("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    handleRegister(nickname, id, password);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>
            <Text style={styles.subtitle}>회원가입</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="이름 / 애칭"
                placeholderTextColor="#FFD6EA"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="아이디"
                placeholderTextColor="#FFD6EA"
                value={id}
                onChangeText={setId}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#FFD6EA"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleRegisterBtn} style={styles.registerbtn}>
                <Text style={{ color: 'white' }}>회원가입</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loginWrapper}>
              <Text style={styles.loginLabel}>계정이 있으신가요?</Text>
              <TouchableOpacity onPress={goLogin}>
                <Text style={styles.loginButton}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: 300,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 36,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#FF5C85',
  },
  inputContainer: {
    marginBottom: 25,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#FF5C85',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#FF5C85',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  registerbtn: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  loginWrapper: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLabel: {
    color: '#555',
    fontSize: 16,
  },
  loginButton: {
    color: '#FF5C85',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default RegisterInputScreen;