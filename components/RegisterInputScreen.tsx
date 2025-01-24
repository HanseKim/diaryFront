import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
} from 'react-native';

type RegisterInputScreenProps = {
  handleRegister: (nickname:string, id: string, password: string) => void, 
  goLogin: ()=> void, 
  style : any 
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
    <View style={style}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>회원가입</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이름 / 애칭"
            placeholderTextColor="#F5BFD9"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>
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
        marginBottom: 10,
      }}>
        <View style={styles.registerText}>
          <Text style={{
            color:'white',
            fontSize:17,
          }}>계정이 없으신가요? </Text>
          <View style={{width:70,marginLeft: 40,marginRight: 100,}}>
            <TouchableOpacity onPress={goLogin}>
              <Text style={{
                color:'white',
                fontSize: 20,
                fontWeight:'bold',
                }}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height:60, marginTop: 10}}>
          <TouchableOpacity onPress={handleRegisterBtn}>
            <View style={styles.registerbtn}>
              <Text style={{color: 'white'}}>회원가입</Text>
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
      elevation: 5, // 안드로이드에서 그림자 효과를 주기 위한 설정
    },
    input: {
      height: 40,
      borderColor: '#FF5C85',
      borderWidth: 1,
      width: '100%',
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: '#fff', // 배경색 추가
    },
    forgotPassword: {
      width: 200,
      color: '#FF5C85',
      marginBottom: 20,
    },
    registerText: {
      width: 250,
      marginTop: 100,
      flexDirection: 'column'
    },
    registerbtn:{
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
      elevation: 5, // 안드로이드에서 그림자 효과를 주기 위한 설정
    }
  });

export default RegisterInputScreen;
