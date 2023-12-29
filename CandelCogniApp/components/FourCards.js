import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CustomButton from './buttons/button';
import pattern from './images/pattern';
import DisplayAnImage from './images/DisplayAnImage';
import globalStyles from '../styles/globalStyles';


const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};

  
const FourCards = ({navigation}) => {

    const [cards, setCards] = useState([]);
    const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage, withoutImage]);
    const [targetImage, setTargetImage] = useState(withoutImage);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    var level = Math.floor(score/1) % pattern.length + 1
    const images = pattern.find(item => item[0] === level )[1];
    
    const TimeLimit = 3;
    const [seconds, setSeconds] = useState(TimeLimit);

    useEffect(() => {
        const interval = setInterval(() => {
        if (seconds > 0) {
            setSeconds(seconds => seconds - 1);
        } else {
            clearInterval(interval); // Detener el intervalo cuando el tiempo llega a cero
        }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);


    useEffect(() => {
        const startNewLevel = () => {
            setSeconds(3);
            let randomimages = [];
            do {
            randomimages = Array.from(
                {length: 4},
                () => images[Math.floor(Math.random() * images.length)],
            );
            } while (
            randomimages[0].id === randomimages[1].id ||
            randomimages[0].id === randomimages[2].id ||
            randomimages[0].id === randomimages[3].id ||
            randomimages[1].id === randomimages[2].id ||
            randomimages[1].id === randomimages[3].id ||
            randomimages[2].id === randomimages[3].id
            );

            setCards(randomimages);
            setQCards(randomimages);
            setFeedbackMessage(''); // Limpiar el mensaje de retroalimentación
            setTargetImage('');
            // Esperar 5 segundos y luego mostrar el icono buscado y ocultar los iconos
            setTimeout(() => {
            setTargetImage(
                randomimages[Math.floor(Math.random() * randomimages.length)],
            );
            console.log(
                '\n----------------randomimages--------------\n ',
                randomimages,
                '\n-----------------------------------------\n',
            );
            setCards([withoutImage, withoutImage, withoutImage, withoutImage]); // Tarjetas sin iconos
            }, 3000);
        };
        startNewLevel();
        }, [score, errors]); // Dependencias de puntuación y errores para iniciar nuevos niveles
        
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
}

export default FourCards;