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

type LoginInputScreenProps = {
  onLogin: (id: string, password: string) => void,
  goRegister: () => void;
}

const LoginInputScreen: React.FC<LoginInputScreenProps> = ({ onLogin, goRegister }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password.length < 4) {
      Alert.alert("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    onLogin(id, password);
  };

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
            <Text style={styles.subtitle}>로그인</Text>
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
              <TouchableOpacity onPress={handleLogin} style={styles.loginbtn}>
                <Text style={{ color: 'white' }}>로그인</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.registerWrapper}>
              <Text style={styles.registerLabel}>계정이 없으신가요?</Text>
              <TouchableOpacity onPress={goRegister}>
                <Text style={styles.registerButton}>회원가입</Text>
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
  loginbtn: {
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
  registerWrapper: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerLabel: {
    color: '#555',
    fontSize: 16,
  },
  registerButton: {
    color: '#FF5C85',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginInputScreen;
