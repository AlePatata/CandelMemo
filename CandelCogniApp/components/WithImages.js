import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Easing, Modal } from 'react-native';
import CustomButton from './buttons/button';
import pattern from './images/pattern';
import DisplayAnImage from './images/DisplayAnImage';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const withoutImage = {
  id: 1,
  path: require('./../assets/target.png'),
  name: 'PNG',
  size_w: 300,
  size_h: 300,
  level: 0,
};

const WithImages = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [targetImage, setTargetImage] = useState(withoutImage);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCards, setShowCards] = useState(false);

  const [userReady, setUserReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const [timerFlipCard, setTimerFlipCard] = useState(3);
  const [timerNextLevel, setTimerNextLevel] = useState(5);

  var level = (Math.floor(score / 1) % pattern.length) + 1;
  const images = pattern.find(item => item[0] === level)[1];

  //genera la primera lista de imagenes
  useEffect(() => {
    generateNewImages()
  }, []);

  //genera una lista de imagenes
  const generateNewImages = () => {
    setFeedbackMessage('');
    let randomimages = [];
    do {
      randomimages = Array.from(
        { length: 3 },
        () => images[Math.floor(Math.random() * images.length)],
      );
    } while (
      randomimages.some(
        (image, index) =>
          randomimages.slice(index + 1).some(otherImage => image.id === otherImage.id),
      )
    );
    setCards(randomimages);
    setQCards(randomimages);
    setTargetImage(randomimages[Math.floor(Math.random() * randomimages.length)]);
    setUserReady(false);
  };

  //maneja la seleccion de una carta
  const handleCardClick = clickedIndex => {
    // Verificar si el índice seleccionado es correcto
    if (qcards[clickedIndex].id === targetImage.id) {
      setScore(score + 1);
      setFeedbackMessage('¡Correcto!');
    } else {
      setErrors(errors + 1);
      setFeedbackMessage('¡Incorrecto!');
    };
    //Vueve a mostrar las imagenes
    setCards(qcards);
    setTimerFlipCard(3)

    //Espera un moemento antes de volver a generar una nueva lista de imagenes
    setTimeout(() => {
      generateNewImages()     
    }, timerNextLevel*1000);
  };

  //Inicia el loop de juego
  const startNewLevel = () => {
    setTimerFlipCard(3);
    setUserReady(true);

    const interval = setInterval(() => {
      setTimerFlipCard(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          setCards([withoutImage, withoutImage, withoutImage]);
          return prevTime;
        }
      });
    }, 1000);
  };

  return (
    <View style={globalStyles.whitecontainer}>
      {/* Modal con las instrucciones */}
      {showInstructions && (
        <Modal animationType="slide" presentationStyle="formSheet">
          <View style={globalStyles.whitecontainer}>
            <View style={{ marginHorizontal: 35 }}>
              <Text style={globalStyles.IinsiderText}>Instrucciones:</Text>
              <Text style={globalStyles.IinsiderText}>
                1. Recuerda la ubicación de las imágenes.
              </Text>
              <Text style={globalStyles.IinsiderText}>
                2. Selecciona la imagen correcta
              </Text>
            </View>
            <View marginVertical={'5%'} />
            <CustomButton
              title={'Continuar'}
              onPress={() => setShowInstructions(false)}
              width="40%"
            />
          </View>
        </Modal>
      )}

      {/* Iconos superiores */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MainPage')}
        style={[globalStyles.supder, { borderWidth: 2, borderRadius: 18 }]}>
        <FontAwesomeIcon icon={faXmark} size={20} color={colors.black} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowInstructions(true)}
        style={globalStyles.supizq}>
        <FontAwesomeIcon icon={faCircleQuestion} size={20} color={colors.black} />
      </TouchableOpacity>

      {/* Resultado de la seleccion */}
      <Text style={globalStyles.resultText}>{feedbackMessage}</Text>

      {/* Lista de cartas */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {cards.map((imagen, index) => (
          <TouchableOpacity
            key={index}
            style={globalStyles.card}
            onPress={() => handleCardClick(index)}>
            {imagen && (
              <Image
                style={[globalStyles.tinyLogo, globalStyles.card]}
                source={imagen.path}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginVertical: 10 }} />

      {/* Contador de segundos hasta voltear las cartas */}
      {userReady && (
        <Text style={globalStyles.resultText}>{timerFlipCard}</Text>
      )}


      {/* Boton de Inicio */}
      {!userReady && !showCards && (
        <CustomButton title="Iniciar" onPress={startNewLevel} width="30%" height={45} />
      )}

      {/* Pregunta por la posición de la tarjeta */}
      {userReady && targetImage && (
        <View style={{ marginTop: '0%' }}>
          <Text style={globalStyles.text}>¿Dónde estaba esta tarjeta?</Text>
          <Image
            style={[{ alignSelf: 'center' }, globalStyles.card]}
            source={targetImage.path}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default WithImages;
