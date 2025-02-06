import React, { useState } from "react";
import {
    View, 
    Text,
    StyleSheet,
    Modal,
    Pressable,
    TextInput,
    TouchableOpacity,
} from 'react-native';

type CoupleModalProps={
    handlemodal: (modal:number) => void
    updateCoupleInfo : (id:string, coupleName:string) => void
    userid: string
}

const CoupleModal:React.FC<CoupleModalProps> = ({handlemodal, updateCoupleInfo, userid}) => {

    const [coupelName, setCoupleName] = useState<string>("");
    const handleSubmit = () =>{
        updateCoupleInfo(userid,coupelName);
        handlemodal(0);
    }

    return (
        <Modal 
            animationType="fade"
            transparent={true}
            onRequestClose={()=>handlemodal(0)}
        >
            <Pressable style={styles.modalOveray} onPress={()=> handlemodal(0)}>
                <View 
                    style={styles.modalContents}
                    onStartShouldSetResponder={() => true}
                >
                    <View>
                        <Text style={{fontSize: 22,fontWeight:'bold'}}>연인의 이름을 적어주세요!</Text>
                    </View>
                    <View>
                        <TextInput
                        value={coupelName}
                        style={styles.inputText}
                        placeholder="이름"
                        placeholderTextColor="gray"
                        onChangeText={setCoupleName}
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.modalbtn}
                        onPress={handleSubmit}
                    >
                        <Text>입력하기</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    )
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
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    inputText : {
        width: 150,
        height: 40,
        padding: 10,
        marginBottom: 10,
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
        fontWeight: 'bold',
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

export default CoupleModal;