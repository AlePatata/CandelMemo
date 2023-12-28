import React, {useState, useEffect, useRef } from 'react';
import {View, Text, TouchableOpacity, Animated, Easing} from 'react-native';
import CustomButton from './buttons/button'
import pattern from './images/pattern';
import DisplayAnImage from './images/DisplayAnImage';
import globalStyles from '../styles/globalStyles';

const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};


const Tutorial = ({ navigation }) => {

    const [cards, setCards] = useState([]);
    const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]);
    const [targetImage, setTargetImage] = useState(withoutImage);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    var level = 9;
    const images = pattern.find(item => item[0] === level )[1];

    const animatedValue = useRef(new Animated.Value(0)).current;

    const [userReady, setUserReady] = useState(false);

    const [showInstructions, setShowInstructions] = useState(true);

    const handleScreenPress = () => {
        setShowInstructions(false);
    };

    useEffect(() => {
        // Configurar la animación
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000, // duración en milisegundos
          easing: Easing.linear, // tipo de interpolación
          useNativeDriver: true, // mejora el rendimiento
        }).start();
    }, []);


    useEffect(() => {
        let randomimages = [];
        do {
            randomimages = Array.from(
            { length: 3 },
            () => images[Math.floor(Math.random() * images.length)],
            );
        } while (
            randomimages[0].id === randomimages[1].id ||
            randomimages[0].id === randomimages[2].id ||
            randomimages[1].id === randomimages[2].id
        );
        setCards(randomimages);
        setQCards(randomimages);
        setTargetImage(
            randomimages[Math.floor(Math.random() * randomimages.length)],
        );
        console.log(
            '\n----------------randomimages--------------\n ',
            randomimages,
            '\n-----------------------------------------\n',
        );
        setUserReady(false);
    }, 
    
    [score, errors]); // Dependencias de puntuación y errores para iniciar nuevos niveles
        
    const handleCardClick = clickedIndex => {
    console.log(
        '\n----------------IMAGE--------------\n ',
        qcards[clickedIndex],
        '\n----------------------------------\n',
    );
    console.log(
        '\n----------------TARGETIMAGE--------------\n ',
        targetImage,
        '\n----------------------------------\n',
    );
    
    // Verificar si el índice seleccionado es correcto
    if (qcards[clickedIndex].id === targetImage.id) {
        setScore(score + 1); // Aumentar la puntuación si es correcto
        setFeedbackMessage('¡Correcto!');
    } else {
        setErrors(errors + 1); // Aumentar el número de errores
        setFeedbackMessage('¡Incorrecto!');
        }
        
    };
    
    const startNewLevel = () => {
        setCards([withoutImage, withoutImage, withoutImage]); // Tarjetas sin iconos
        setUserReady(true);
    };

    return (
        <View
            style={globalStyles.whitecontainer} onTouchStart={handleScreenPress}>
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
        {!userReady && <CustomButton title="Estoy listo" onPress={startNewLevel} width='30%' height={45}/>}
        {feedbackMessage !== '' && <Text>{feedbackMessage}</Text>}
        {userReady && targetImage && (
            <View style={{marginTop: 10}}>
                <Text style={globalStyles.text}>Imagen buscada:</Text>
                <DisplayAnImage source={targetImage.path}  />
            </View> 
        )}

        {showInstructions && (
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>¡Instrucciones! Toque para continuar</Text>
            </TouchableOpacity>
        )}
        <Text style={globalStyles.text}>Puntuación: {score}</Text>
        <Text style={globalStyles.text}>Errores: {errors}</Text>
        <Animated.View
            style={{
                opacity: animatedValue, // por ejemplo, animar la opacidad
                transform: [
                    {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100], // animar en el eje Y de 0 a 100
                    }),
                    },
                ],
            }}
        >
            <Text>¡Animación en React Native!</Text>
        </Animated.View>
        <CustomButton
            title="Terminal tutorial"
            onPress={() => navigation.navigate('MainPage')}
            width='70%'
        />
    </View>
    )
}

export default Tutorial;