import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import CustomButton from './buttons/button'
import pattern from './images/pattern';
import DisplayAnImage from './images/DisplayAnImage';
import globalStyles from '../styles/globalStyles';

const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};


const WithImages = ({ navigation }) => {
    const [cards, setCards] = useState([]);
    const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]);
    const [targetImage, setTargetImage] = useState(withoutImage);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [showCards, setShowCards] = useState(false);

    var level = Math.floor(score/1) % pattern.length + 1;
    const images = pattern.find(item => item[0] === level )[1];

    const adjustDifficulty = () => {
        setQCards([withoutImage, withoutImage, withoutImage, withoutImage])
    };
    
    const TimeLimit = 3;
    const [seconds, setSeconds] = useState(TimeLimit);

    const [modalVisible, setModalVisible] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);

    
    useEffect(() => {
        const interval = setInterval(() => {
        if (seconds > 0) {
            setSeconds(seconds => seconds - 1);
        } else {
            clearInterval(interval); // Stop the interval when time is 0
        }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);


    useEffect(() => {
        const handleScreenPress = () => {
            setShowInstructions(false);
            setModalVisible(false)
        };
        // Función para iniciar un nuevo nivel
        const startNewLevel = () => {
            setSeconds(3);
            let randomimages = [];
            const numberOfCards = qcards.length;
            do {
              randomimages = Array.from({ length: numberOfCards }, () =>
                images[Math.floor(Math.random() * images.length)]
              );
            } while (
              randomimages.some(
                (image, index) =>
                  randomimages.slice(index + 1).some((otherImage) => image.id === otherImage.id)
              )
            );
      
            setCards(randomimages);
            setQCards(randomimages);
            setFeedbackMessage(''); // Limpiar el mensaje de retroalimentación
            setTargetImage('');
            setTimeout(() => {
              setTargetImage(randomimages[Math.floor(Math.random() * randomimages.length)]);
              setCards(Array.from({ length: numberOfCards }, () => withoutImage)); // Tarjetas sin iconos
              setShowCards(true); // Mostrar las tarjetas después de mostrar el icono buscado
            }, 3000);
          };

        if (!showInstructions) {
        startNewLevel();
        }
       
        }, [score, errors, showInstructions, qcards.length]); // Dependencias de puntuación y errores para iniciar nuevos niveles
        
        const handleCardClick = clickedIndex => {                
            console.log(
                '\n----------------IMAGE--------------\n ',
                qcards[clickedIndex].id,
                '\n----------------------------------\n',
            );
            console.log(
                '\n----------------TARGETIMAGE--------------\n ',
                targetImage.id,
                '\n----------------------------------\n',
            );
            

            // Verificar si el índice seleccionado es correcto
            if (qcards[clickedIndex].id === targetImage.id) {
                setScore(score + 1); // Aumentar la puntuación si es correcto
                setFeedbackMessage('¡Correcto!');
                if ( score + 1 >= pattern.length ) {
                    adjustDifficulty()
                }
            } else {
                setErrors(errors + 1); // Aumentar el número de errores
                setFeedbackMessage('¡Incorrecto!');
            }
            
        };
    const ThreeCards = () => {
        if (showInstructions) {return (null)}
        return (
            <View
                style={globalStyles.whitecontainer}>
                <Text style={globalStyles.title}>Encuentra la imagen</Text>
            
                <View
                    style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    {cards.map((imagen, index) => (
                        <TouchableOpacity
                            key={index}
                            style={globalStyles.card}
                            onPress={() => handleCardClick(index)}>
                            {imagen && <DisplayAnImage source={imagen.path}/>}
                        </TouchableOpacity> 
                    ))}
                </View>
                {seconds > 0 && <Text>{seconds}</Text>}
                {feedbackMessage !== '' && <Text>{feedbackMessage}</Text>}
                {targetImage && (
                    <View style={{marginTop: 10}}>
                        <Text style={globalStyles.text}>Imagen buscada:</Text>
                        <DisplayAnImage source={targetImage.path}  />
                    </View> 
                )}
                <Text style={globalStyles.text}>Puntuación: {score}</Text>
                <Text style={globalStyles.text}>Errores: {errors}</Text>
                <CustomButton
                    title="Regresar"
                    onPress={() => navigation.navigate('MainPage')}
                    width='70%'
                />
                
            </View>
        )
    };
    const FourCards = () => {
        return (
            <View
                style={globalStyles.whitecontainer}>
                <Text style={globalStyles.title}>Encuentra la imagen</Text>
    
                <View style={{ flexDirection: 'column' }}>
                    
                    <View style={{ flexDirection: 'row', marginBottom: 0 }}>
                        {cards.slice(0, 2).map((imagen, index) => (
                            <TouchableOpacity
                                key={index}
                                style={globalStyles.card}
                                onPress={() => handleCardClick(index)}>
                                {imagen && <DisplayAnImage source={imagen.path} />}
                            </TouchableOpacity>
                        ))}
                    </View>
    
                    
                    <View style={{ flexDirection: 'row', marginBottom: 0 }}>
                        {cards.slice(2, 4).map((imagen, index) => (
                            <TouchableOpacity
                                key={index + 2}
                                style={globalStyles.card}
                                onPress={() => handleCardClick(index + 2)}>
                                {imagen && <DisplayAnImage source={imagen.path} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
    
        
                {seconds > 0 && <Text>{seconds}</Text>}
                {feedbackMessage !== '' && <Text>{feedbackMessage}</Text>}
                {targetImage && (
                    <View style={{marginTop: 10}}>
                        <Text style={globalStyles.text}>Imagen buscada:</Text>
                        <DisplayAnImage source={targetImage.path}  />
                    </View> 
                )}
                <Text style={globalStyles.text}>Puntuación: {score}</Text>
                <Text style={globalStyles.text}>Errores: {errors}</Text>
                <CustomButton
                    title="Regresar"
                    onPress={() => navigation.navigate('MainPage')}
                    width='70%'
                />
            </View>
        )
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
                setModalVisible(!modalVisible);
                setShowInstructions(false);
            }}>    
                    
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        setModalVisible(false);
                        setShowInstructions(false)}} >
                            <View style={globalStyles.orangecontainer}>
                            {showInstructions && 
                            <Text style={globalStyles.insiderText}>Preparado?</Text>}
                            </View>
                    
                </TouchableOpacity>
            </Modal>
            
            {!showInstructions && (qcards.length === 3 ? <ThreeCards /> : <FourCards />)}
        </View>
      );  
};

export default WithImages;