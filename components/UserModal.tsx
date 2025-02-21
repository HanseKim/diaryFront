import React, { TimeHTMLAttributes, useMemo, useState } from "react";
import {
    View, 
    Text,
    StyleSheet,
    Modal,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { TextInput } from "react-native-gesture-handler";

type UserModalProps={
    handlemodal: (modal:number) => void
    updateUserInfo: (newDate: string, coupleName: string) => void
    updateUserDate: (newDate: string) => void
}
const UserModal:React.FC<UserModalProps> = ({handlemodal, updateUserInfo, updateUserDate}) => {
    const [coupleName, setCoupleName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    
    const validateDate = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식
        return regex.test(dateString);
    };
    
    const handleSubmit = () => {
        if (!date || !validateDate(date)) {

            return;
        }
        if(coupleName === ''){
            updateUserDate(date);
            handlemodal(0);
            return;
        }
        updateUserInfo(date, coupleName); 
        handlemodal(0);
    };

    return (
        <Modal 
            animationType="fade"
            transparent={true}
            onRequestClose={() => handlemodal(0)}
        >
            <Pressable style={styles.modalOveray} onPress={() => handlemodal(0)}>
                <View 
                    style={styles.modalContents}
                    onStartShouldSetResponder={() => true}
                >
                    <Text style={styles.modaltitle}>프로필 수정하기</Text>
                    <View style={styles.input}>
                        <View style={styles.inputComponent}>
                            <Text style={{ fontWeight: 'bold' }}>처음 만난 날</Text>
                            <TextInput
                                style={styles.inputText}
                                placeholder="2025-01-18"
                                placeholderTextColor="gray"
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>
                        <View style={styles.inputComponent}>
                            <Text style={{fontWeight:'bold'}}>연인의 이름 입력하기</Text>
                            <TextInput
                            value={coupleName}
                            style={styles.inputText}
                            placeholder="이름"
                            placeholderTextColor="gray"
                            onChangeText={setCoupleName}
                            />
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.modalbtn} 
                        onPress={handleSubmit}
                    >
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>입력하기</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOveray:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalContents:{
        width: 300,
        height: 400,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    modaltitle : {
        fontSize: 22,
        fontWeight: 'bold'
    },
    input : { 
        width: '100%', 
        height: '60%',
        justifyContent: 'space-evenly', 
        alignItems: 'center',
    },
    inputComponent : {
        height: '40%',
        alignItems : 'center',
        justifyContent : 'space-around'
    },
    inputText : {
        width: 150,
        height: 40,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
    },
    modalbtn : {
        width: 160,
        height: 30,
        backgroundColor: '#F5BFD9',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F5BFD9',
        shadowOffset: {
        width: 5,
        height: 5,
        },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
})

export default UserModal;

function alert(arg0: string) {
    throw new Error("Function not implemented.");
}
