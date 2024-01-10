import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, Easing, Modal} from 'react-native';
import CustomButton from './buttons/button'
import pattern from './images/pattern';
import DisplayAnImage from './images/DisplayAnImage';
import globalStyles from '../styles/globalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faCircleXmark,
    faCircleQuestion,
    faCircle
} from '@fortawesome/free-solid-svg-icons';
import colors from '../styles/colors';

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
    const rotationValue = useRef(new Animated.Value(0)).current;

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
            randomimages.some(
                (image, index) =>
                  randomimages.slice(index + 1).some((otherImage) => image.id === otherImage.id)
            )
        );
        Animated.timing(rotationValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start(() => {
            setCards(randomimages);
            setQCards(randomimages);
            setTargetImage(
                randomimages[Math.floor(Math.random() * randomimages.length)],
            );
            rotationValue.setValue(0);
        });
        
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
        Animated.timing(rotationValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            setCards([withoutImage, withoutImage, withoutImage]); // Tarjetas sin iconos
            rotationValue.setValue(0);
        });    
        setUserReady(true);
    };
    const rotateCard = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      });

    return (

        <View style={globalStyles.whitecontainer} >
            <TouchableOpacity onPress={() => navigation.navigate('MainPage')} style={globalStyles.supder}>
                <FontAwesomeIcon icon={faCircleXmark} size={32} color={colors.black}/>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowInstructions(true)} style={globalStyles.supizq}>
                <FontAwesomeIcon icon={faCircleQuestion} size={32} color={colors.black}/>
            </TouchableOpacity>
            
            {showInstructions && (
                <Modal
                animationType="slide"
                presentationStyle='formSheet'>
                    <View style={globalStyles.whitecontainer}>
                        <View style={[globalStyles.Icontainer]}>
                            <Text style={globalStyles.IinsiderText}> Instrucciones: {'\n'}
                                Este es un juego de memoria. Se mostrarán imágenes, 
                                de las cuales debes recordar su ubicación, 
                                para luego seleccionar la imagen correcta.
                                Pulsa la pantalla para continuar
                            </Text>
                        </View>
                        <View marginVertical={'5%'}/>
                        <CustomButton title={"Continuar"} onPress={() => setShowInstructions(false)} width='40%'/>
                    </View>
                </Modal>
                )
            }
            <Text style={globalStyles.title}>Encuentra la imagen</Text>
            <View style={{ marginVertical: 10 }} /> 
            <View
                style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                {cards.map((imagen, index) => (
                    
                    <TouchableOpacity
                        key={index}
                        style={globalStyles.card}
                        onPress={() => handleCardClick(index)}>
                        {imagen && <Animated.Image
                            style={[
                            globalStyles.tinyLogo,
                            globalStyles.card,
                            { transform: [{ rotateY: rotateCard }] },
                            ]}
                            source={imagen.path}
                            resizeMode="contain"
                        />}
                    </TouchableOpacity> 
                    
                ))}
                
            </View>
            <Animated.View style={{
                opacity: animatedValue, // por ejemplo, animar la opacidad
                transform: [
                    {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 10], // animar en el eje Y de 0 a 100
                    }),
                    },
                ],
                }}>
                {!userReady && <Text style={globalStyles.text}>Cuando hayas memorizado las tarjetas pulsa "Estoy listo"</Text>}
            </Animated.View>
            <View style={{ marginVertical: 10 }} /> 
            {!userReady && <CustomButton title="Estoy listo" onPress={startNewLevel} width='30%' height={45}/>}
            
            {!userReady && feedbackMessage !== '' && <Text>{feedbackMessage}</Text>}
            {userReady && targetImage && (
                <View style={{marginTop: 10}}>
                    <Text style={globalStyles.text}>Imagen buscada:</Text>
                    <Animated.Image
                            style={[
                            globalStyles.tinyLogo,
                            globalStyles.card,
                            { transform: [{ rotateY: rotateCard }] },
                            ]}
                            source={targetImage.path}
                            resizeMode="contain"
                        />
                </View> 
            )}
            
            
        </View>
    )
}

export default Tutorial;