import React, { useState } from "react";
import {
    View, 
    Text,
    StyleSheet,
    Modal,
    Pressable,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { TextInput } from "react-native-gesture-handler";

type UserModalProps = {
    handlemodal: (modal: number) => void;
    updateUserInfo: (newDate: string, coupleName: string) => void;
    updateUserDate: (newDate: string) => void;
};

const UserModal: React.FC<UserModalProps> = ({
    handlemodal,
    updateUserInfo,
    updateUserDate
}) => {
    const [coupleName, setCoupleName] = useState<string>("");
    const [date, setDate] = useState<string>("");
    
    const validateDate = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    };
    
    const handleSubmit = () => {
        if (!date || !validateDate(date)) {
            Alert.alert("날짜 형식 오류", "YYYY-MM-DD 형식으로 입력해주세요");
            return;
        }
        if (coupleName === '') {
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
            <Pressable style={styles.modalOverlay} onPress={() => handlemodal(0)}>
                <View 
                    style={styles.modalContents}
                    onStartShouldSetResponder={() => true}
                >
                    <View style={styles.ribbon}>
                        <View style={styles.ribbonEnd} />
                    </View>

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>프로필 수정하기</Text>
                        <View style={styles.headerDecoration} />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>처음 만난 날</Text>
                            <View style={styles.inputBox}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2025-01-18"
                                    placeholderTextColor="#FFB6C1"
                                    value={date}
                                    onChangeText={setDate}
                                />
                            </View>
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>연인의 이름</Text>
                            <View style={styles.inputBox}>
                                <TextInput
                                    value={coupleName}
                                    style={styles.input}
                                    placeholder="이름을 입력해주세요"
                                    placeholderTextColor="#FFB6C1"
                                    onChangeText={setCoupleName}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>입력하기</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(211, 211, 211, 0.7)', 
    },
    modalContents: {
        width: 320,
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFE5EC',
        shadowColor: '#FFB6C1',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    ribbon: {
        position: 'absolute',
        top: -15,
        width: 60,
        height: 30,
        backgroundColor: '#FF9CB1',
        borderRadius: 8,
        transform: [{ rotate: '-5deg' }],
    },
    ribbonEnd: {
        position: 'absolute',
        bottom: -10,
        left: 20,
        width: 20,
        height: 20,
        backgroundColor: '#FF9CB1',
        transform: [{ rotate: '45deg' }],
    },
    modalHeader: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6699',
        marginBottom: 8,
    },
    headerDecoration: {
        width: 40,
        height: 3,
        backgroundColor: '#FFB6C1',
        borderRadius: 2,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 25,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FF6699',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputBox: {
        backgroundColor: '#FFF5F7',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFE5EC',
        paddingHorizontal: 15,
        height: 45,
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        color: '#FF6699',
    },
    submitButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#FF9CB1',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFB6C1',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default UserModal;