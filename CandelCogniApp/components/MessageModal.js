import {View, Text, Modal, TouchableWithoutFeedback} from 'react-native';
import CustomButton from './buttons/button';
import globalStyles from '../styles/globalStyles';


const MessageModal = ({ visible, message, onClose }) => {
    
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={globalStyles.modalOverlay}>
            <View style={globalStyles.modalContent}>
                <Text>{message}</Text>
                <CustomButton></CustomButton>
            </View>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
};
export default MessageModal;