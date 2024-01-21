import React, { useState } from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import CustomButton from "./buttons/button";
import TutorialModalStyle from "../styles/tutorialModalStyle";
import globalStyles from "../styles/globalStyles";  
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import colors from "../styles/colors";




const TutorialModal = ({changeMenuState}) => {
    const [modalProgress, setModalProgress] = useState(1);
    const [sequence, setSequence] = useState([]);
    return (
      <View style={styles.container}>
        
          <View style={{position: "absolute", right: 0, top: 0, zIndex:1}}>
          <TouchableOpacity onPress={() => navigation.navigate('MainPage')} style={[globalStyles.supder, {borderWidth: 2, borderRadius: 18}]}>
                <FontAwesomeIcon icon={faXmark} size={20} color={colors.black}/>
            </TouchableOpacity>
          </View>
      {modalProgress === 1 && (
        
          <View style={globalStyles.whitecontainer}>
            <View style={TutorialModalStyle.modalContainer}>
              <Text style={TutorialModalStyle.tutorialTitle}>Instrucciones</Text>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
                Este es un juego de memoria. Se mostrarán imágenes, 
                de las cuales debes recordar su ubicación, 
                para luego seleccionar la imagen correcta.
              </Text>
           
            <CustomButton
              title={'Comenzar'}
              onPress={() => {

                startNewLevel()
                timeOut = setTimeout(()=>{
                  handleFinish()
                }, 4*60*1000); // 4 m   inutos

              }}
              width="40%"
            />
             </View>
          </View>
        
      )};
    </View>
    );
}; 
export default TutorialModal;