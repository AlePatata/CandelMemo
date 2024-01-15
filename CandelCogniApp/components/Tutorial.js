import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, Easing, Modal, Image} from 'react-native';
import CustomButton from './buttons/button'
import pattern from './images/pattern';
import globalStyles from '../styles/globalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faXmark,
    faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import colors from '../styles/colors';

const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};

/** The tutorial is a simpliest version of WithImages, there is always 3 cards and the same level.
 * The mechanism of ask for an image is actionate by a button.
 * 
 * @param {*}  
 * @returns 
 */
const Tutorial = ({ navigation }) => {
    const [cards, setCards] = useState([]); // cards is a list of the 3 cards in turn to show.
    const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]); // qcards is a list of the 3 cards in turn.
    const [targetImage, setTargetImage] = useState(withoutImage); // targetImage is the image to ask.
    const [score, setScore] = useState(0); // is the record of the correct score of the game.
    const [errors, setErrors] = useState(0); // is the record of the incorrect score of the game.
    const [feedbackMessage, setFeedbackMessage] = useState(''); // is the message to show after pick a card.
    const [showFeedback, setShowFeedback] = useState(false); // showFeedback is the element to stop the game and create a feedback instance.

    var level = 1; // corresponds to the "fruit level" designated in pattern.js.
    const images = pattern.find(item => item[0] === level )[1]; // list of elements containing image addresses.

    const animatedValue = useRef(new Animated.Value(0)).current; // animated object for linear movements.
    const rotationValue = useRef(new Animated.Value(0)).current; // animated object for card movements.

    const [userReady, setUserReady] = useState(false); // element that allows you to turn over the cards.
    const [showInstructions, setShowInstructions] = useState(true); // element for show the instruction modal.

    /** Configuration for linear movement animation */
    useEffect(() => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000, 
          easing: Easing.linear, 
          useNativeDriver: true, 
        }).start();
    }, []);

    /** Game logic */
    useEffect(() => {
        let randomimages = [];
        do { // Make a random array of 3 images
            randomimages = Array.from(
            { length: 3 },
            () => images[Math.floor(Math.random() * images.length)],
            );
        } while ( // As long as they are all different
            randomimages.some(
                (image, index) =>
                  randomimages.slice(index + 1).some((otherImage) => image.id === otherImage.id)
            )
        );

        // Save the random cards in both cards and qcards:
        setCards(randomimages);
        setQCards(randomimages);
        setTargetImage( // Pick a random card from the selection
            randomimages[Math.floor(Math.random() * randomimages.length)],
        );
        
        console.log(
            '\n----------------randomimages--------------\n ',
            randomimages,
            '\n-----------------------------------------\n',
        );
        setUserReady(false);
    }, 
    [score, errors]); // Score dependencies and errors to start new levels
        
    /** Mechanics to distinguish the correct card after choosing it */
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
        setCards(qcards); // Show the asked cards again
        setShowFeedback(true); // Instance for feedback
        // Check if the selected index is correct
        if (qcards[clickedIndex].id === targetImage.id) {
            setTimeout(()=> {setScore(score + 1); setShowFeedback(false) },3000)
            setFeedbackMessage('¡Correcto!');
        } else {
            setTimeout(()=> {setScore(errors + 1); setShowFeedback(false) },3000)
            setFeedbackMessage('¡Incorrecto!');
        }   
    };
    
    /** Starts a new round */
    const startNewLevel = () => {
        setCards([withoutImage, withoutImage, withoutImage]); // Reset the cards
        setUserReady(true);
    };

    const rotateCard = rotationValue.interpolate({ // Flip a card animation
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={globalStyles.whitecontainer} > 
            {/* X and ? Buttons */}
            <TouchableOpacity onPress={() => navigation.navigate('MainPage')} style={[globalStyles.supder, {borderWidth: 2, borderRadius: 18}]}>
                <FontAwesomeIcon icon={faXmark} size={20} color={colors.black}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowInstructions(true)} style={globalStyles.supizq}>
                <FontAwesomeIcon icon={faCircleQuestion} size={20} color={colors.black}/>
            </TouchableOpacity>
            
            {/* Instruction Modal */}
            {showInstructions && (
                <Modal
                animationType="slide"
                presentationStyle='formSheet'>
                    <View style={globalStyles.whitecontainer}>
                        <View style={[globalStyles.Icontainer]}>
                            <Text style={globalStyles.IinsiderText}> 
                                Instrucciones: {'\n'}
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

            {/* 3 Cards */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                {cards.map((imagen, index) => (
                    <TouchableOpacity
                        key={index}
                        style={globalStyles.card}
                        onPress={() => { if(userReady && !showFeedback) handleCardClick(index)}}> 
                        {/* Mechanic for show cards again and give feedback: */}              
                        {!showFeedback ? (
                            <Image
                                style={[
                                globalStyles.tinyLogo,
                                globalStyles.card]}
                                source={imagen.path}
                                resizeMode="contain"
                            />
                        ) : (   
                            (qcards[index].id === targetImage.id ? (
                                <Image
                                    style={[
                                    globalStyles.tinyLogo,
                                    globalStyles.card,
                                    {borderColor:colors.green} 
                                    ]}
                                    source={imagen.path}
                                    resizeMode="contain"
                                />
                            ) : ( 
                                <Image
                                    style={[
                                    globalStyles.tinyLogo,
                                    globalStyles.card,
                                    {borderColor:colors.red} 
                                    ]}
                                    source={imagen.path}
                                    resizeMode="contain"
                                />   
                            ))
                        )}
                    </TouchableOpacity> 
                ))}
            </View>
            
            {/* Animation for a short intruction */}
            <Animated.View style={{ opacity: animatedValue, 
                transform: [{ translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10]}),
                    },],
                }}> 
                {!userReady && <Text style={globalStyles.text}>Cuando hayas memorizado las tarjetas pulsa "Estoy listo"</Text>}
            </Animated.View>

            {/* "Estoy Listo" Button: */}
            <View style={{ marginVertical: 10 }} /> 
            {!userReady  && <CustomButton title="Estoy listo" onPress={startNewLevel} width='30%' height={45}/>}
            
            {/* feedback messagge: */}
            {showFeedback && feedbackMessage !== '' && <Text style={globalStyles.text}>{feedbackMessage}</Text>}
            
            {/* Asked Card: */}
            {userReady && targetImage && (
                <View style={{marginTop: '0%'}}>
                    <Text style={globalStyles.text}>¿Dónde estaba esta tarjeta?</Text>
                    <Image style={[
                        {alignSelf: "center"},
                        globalStyles.card,]}
                        source={targetImage.path}
                        resizeMode="contain"
                    />
                </View> 
            )}
        </View>
    )
}

export default Tutorial;