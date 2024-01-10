import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, Animated} from 'react-native';
import CustomButton from './buttons/button';
import pattern from './images/pattern';
import globalStyles from '../styles/globalStyles';


const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};

/** Este archivo es temporal para entender como implementar la animacion de las tarjetas 
 * 
 * 
 * 
 * @param {*} param0 
 * @returns 
 */
  
const Temporal = ({navigation}) => {
    const [cards, setCards] = useState([]);
    const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage, withoutImage]);
    const [targetImage, setTargetImage] = useState(withoutImage);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    var level = 1
    const images = pattern.find(item => item[0] === level )[1];
    
    const [userReady, setUserReady] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    const rotateValue = useRef(new Animated.Value(0)).current;  

    const flipAnimation = useRef(new Animated.Value(0)).current;

    const flipStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };
    
    useEffect(() => {
        let randomimages = [];
        do {
            randomimages = Array.from(
            { length: 2 },
            () => images[Math.floor(Math.random() * images.length)],
            );
        } while (
            randomimages.some(
                (image, index) =>
                    randomimages.slice(index + 1).some((otherImage) => image.id === otherImage.id)
            )
        );
        setCards(randomimages);
        setQCards(randomimages);

        setTargetImage(
            randomimages[Math.floor(Math.random() * randomimages.length)],
        );
        setUserReady(false);
    }, 
    [score, errors]); // Dependencias de puntuación y errores para iniciar nuevos niveles
        
        const handleCardClick = clickedIndex => {
            Animated.timing(flipAnimation, {
                toValue: 180,
                duration: 500,
                useNativeDriver: false,
              }).start()
    
    }
    const startNewLevel = () => {
        setCards([withoutImage, withoutImage]); // Tarjetas sin iconos
        setUserReady(true);
    };
    

    return (
        <View
            style={globalStyles.whitecontainer}>
            <Text style={globalStyles.title}>Encuentra la imagen</Text>  
                <View style={{ flexDirection: 'row', marginBottom: 0 }}>
                    {feedbackMessage === "" && cards.map((imagen, index) => (
                        <TouchableOpacity
                            key={index}
                            style={globalStyles.card}
                            onPress={handleCardClick(index)}>
                            {imagen && (
                                <Animated.View style={[globalStyles.card, flipStyle]}>
                                    <Image style={globalStyles.card} source={imagen.path} resizeMode="contain" />
                                </Animated.View>
                            )}
                            </TouchableOpacity>
                    ))}
                </View>
    
            {feedbackMessage !== '' && <Text>{feedbackMessage}</Text>}
            {userReady && targetImage && (
                <View style={{marginTop: 10}}>
                    <Text style={globalStyles.text}>Imagen buscada:</Text>
                    <Animated.Image 
                    style={[
                        globalStyles.card,
                        { transform: [{ rotate: rotateValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] },
                    ]} 
                    source={targetImage.path} 
                    resizeMode="contain" />
                </View> 
            )}
            <CustomButton title="Estoy listo" onPress={startNewLevel} width='30%' height={45}/>
            
        </View>
    )
}

export default Temporal;