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
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

type UserModalProps={
    handlemodal: (modal:number) => void
    updateUserInfo: (newDate: string, options: string) => void
}
const UserModal:React.FC<UserModalProps> = ({handlemodal, updateUserInfo}) => {
    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: '100일 단위',
            value: 'option1'
        },
        {
            id: '2',
            label: '1년 단위',
            value: 'option2'
        }
    ]), []);
    
    const [date, updateDate] = useState<string>("");
    const [options, setOptions] = useState<string>("100일 단위"); // 기본값 설정

    const handleRadioSelect = (selectedId: string | undefined) => {
        if (selectedId === "1") setOptions("100일 단위");
        if (selectedId === "2") setOptions("1년 단위");
    };
    
    const validateDate = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식
        return regex.test(dateString);
    };
    
    const handleSubmit = () => {
        if (!date || !validateDate(date)) {
            console.log("날짜 입력 제대로");
            return;
        }
        if (!options) {
            console.log("options 입력 제대로");
            return;
        }

        updateUserInfo(date, options); // updateUserInfo 호출
        handlemodal(0); // 모달 닫기
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
                    <View style={{ width: 200, height: 80, marginTop: 20, justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>처음 만난 날</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="2025-01-18"
                            placeholderTextColor="gray"
                            value={date}
                            onChangeText={updateDate}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>기념일 표시단위</Text>
                        <RadioGroup
                            radioButtons={radioButtons}
                            onPress={(selectedId) => {
                                setOptions(selectedId || "");
                                handleRadioSelect(selectedId);
                            }}
                            selectedId={options === "100일 단위" ? "1" : "2"} // 초기값에 맞춰 설정
                            layout="row"
                        />
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
