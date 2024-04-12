import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CustomButton from './buttons/button'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCircle,
    faSquare,
    faStar,
    faHeart,
    faPlay,
    faDiamond,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';


const icons = [faCircle, faSquare, faStar, faHeart, faPlay, faDiamond];
const sinIcono = faQuestionCircle;

/** Game es la lógica original del juego, que recibí al tomar este proyecto.
 * Este contempla toda la funcionalidad del juego pero con iconos de fontawesome.
 */

const Game = ({ navigation }) => {

    const [cards, setCards] = useState([]);
    const [qcards, setQCards] = useState([sinIcono, sinIcono, sinIcono]);
    const [targetIcon, setTargetIcon] = useState(null);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');


    useEffect(() => {
        // Función para iniciar un nuevo nivel
        const startNewLevel = () => {
            let randomIcons = [];
            do {
            randomIcons = Array.from(
                {length: 3},
                () => icons[Math.floor(Math.random() * icons.length)],
            );
            } while (
            randomIcons[0] === randomIcons[1] ||
            randomIcons[0] === randomIcons[2] ||
            randomIcons[1] === randomIcons[2]
            );

            setCards(randomIcons);
            setQCards(randomIcons);
            setFeedbackMessage(''); // Limpiar el mensaje de retroalimentación
            setTargetIcon('');
            // Esperar 5 segundos y luego mostrar el icono buscado y ocultar los iconos
            setTimeout(() => {
            setTargetIcon(
                randomIcons[Math.floor(Math.random() * randomIcons.length)],
            ); // Icono buscado
            console.log(
                '\n----------------randomIcons--------------\n ',
                randomIcons,
                '\n-----------------------------------------\n',
            );
            setCards([sinIcono, sinIcono, sinIcono]); // Tarjetas sin iconos
            }, 3000);
        };

        // Iniciar un nuevo nivel cuando se carga la aplicación y después de cada intento
        startNewLevel();
        }, [score, errors]); // Dependencias de puntuación y errores para iniciar nuevos niveles

        const handleCardClick = clickedIndex => {
        console.log(
            '\n----------------ICON--------------\n ',
            qcards[clickedIndex],
            '\n----------------------------------\n',
        );
        console.log(
            '\n----------------TARGETICON--------------\n ',
            targetIcon,
            '\n----------------------------------\n',
        );

        // Verificar si el índice seleccionado es correcto
        if (qcards[clickedIndex] === targetIcon) {
            setScore(score + 1); // Aumentar la puntuación si es correcto
            setFeedbackMessage('¡Correcto!');
        } else {
            setErrors(errors + 1); // Aumentar el número de errores
            setFeedbackMessage('¡Incorrecto!');
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',  // Color fondo
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            
            
            <Text style={{fontSize: 24, marginBottom: 20}}>Encuentra el icono</Text>
            <View
                style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                {cards.map((icon, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            backgroundColor: 'orange',
                            height: 60,
                            width: 60,
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 10,
                            borderRadius: 5,
                        }}
                        onPress={() => handleCardClick(index)}>
                        {icon && <FontAwesomeIcon icon={icon} size={32} color="dodgerblue" />}
                    </TouchableOpacity> // Color 3 iconos
                ))}
                
        </View>
        
        {feedbackMessage !== '' && <Text>{feedbackMessage}</Text>}
        {targetIcon && (
            <View style={{marginTop: 20}}>
                <Text>Icono buscado:</Text>
                <FontAwesomeIcon icon={targetIcon} size={32} color="black" />
            </View>  // Color icono misterioso
        )}
        <Text style={{marginTop: 20}}>Puntuación: {score}</Text>
        <Text>Errores: {errors}</Text>
        <CustomButton
            title="Regresar"
            onPress={() => navigation.navigate('MainPage')}
            width='70%'
        />
    </View>
    )
}

export default Game;