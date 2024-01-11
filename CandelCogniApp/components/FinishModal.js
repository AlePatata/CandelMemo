import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../styles/colors";

// componente que muestra el modal de fin de juego
const FinishModal = ({showFinish, score, closeModal, startGame}) => {
    // renderiza el componente
    return(
    <Modal isVisible={showFinish}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Juego Terminado</Text>
            <Text style={styles.modalText}>Puntaje Final: {score}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Volver al Menú</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={startGame}>
                <Text style={styles.modalButtonText}>Volver a Jugar</Text>
            </TouchableOpacity>
        </View>
    </Modal>
    )
}
// estilos del componente
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "black"
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        color: "black"
    },
    modalButton: {
        backgroundColor: colors.yellow,
        padding: 10,
        borderRadius: 5,
        width: 150,
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
})

export default FinishModal;