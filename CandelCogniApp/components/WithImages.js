import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Easing, Modal, StyleSheet, Pressable } from 'react-native';
import CustomButton from './buttons/button';
import pattern from './images/pattern';
import DisplayAnImage from './images/DisplayAnImage';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import FinishModal from './FinishModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};

const WithImages = ({ navigation }) => {
  //cartas
  const [cards, setCards] = useState([]);
  const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [targetImage, setTargetImage] = useState(withoutImage);

  //datos del juego
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [plays, setPlays] = useState([]);
  const [time, setTime] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  let interval = null;
  let timeOut = null;

  
  //muestran componentes visuales
  const [userReady, setUserReady] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showFinish, setShowFinish] = useState(false);


  //Temporizadores
  const [timerFlipCard, setTimerFlipCard] = useState(3);
  const [timerNextLevel, setTimerNextLevel] = useState(7);

  var level = (Math.floor(score / 1) % pattern.length) + 1;
  const images = pattern.find(item => item[0] === level)[1];

  //genera la primera lista de imagenes
  useEffect(() => {
    generateNewImages()
  }, []);

  //genera una lista de imagenes de largo X
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

    if (showCards) {
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
        setScore(score + 1);
        setFeedbackMessage('¡Correcto!');
        setPlays(plays.concat({ 
          indice: plays.length,
          resultado: 'Correcto',
          tiempo: time-lastTime-timerFlipCard, 
        }));
      } else {
        setErrors(errors + 1);
        setFeedbackMessage('¡Incorrecto!');
        setPlays(plays.concat({ 
          indice: plays.length,
          resultado: 'Incorrecto',
          tiempo: time-lastTime-timerFlipCard, 
        }));
  
      };
      //Vuelve a mostrar las imágenes
  
      setCards(qcards);
      setTimerFlipCard(3);
      setShowTimer(false)
      
      
  
      //Muestra el modal con el feedback
      setModalVisible(!modalVisible)
  
      //Espera un momento antes de volver a generar una nueva lista de imágenes
      setTimeout(() => {
        generateNewImages()
        startNewLevel()     
      }, timerNextLevel*1000);      
    }
  };

  //Inicia el loop de juego
  const startNewLevel = () => {
    setTimerFlipCard(3);
    setUserReady(true);
    setLastTime(time);
    setShowTimer(true)
    setShowCards(false)

    const interval = setInterval(() => {
      setTimerFlipCard(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setShowTimer(false)
          clearInterval(interval);
          setCards([withoutImage, withoutImage, withoutImage]);
          setShowCards(true)
          return prevTime;
        }
      });
    }, 1000);
  };

  /**
   * Función que maneja el fin del juego
   * @function handleFinish
   * @returns {void}
   * @memberof WithImages
   * @description Muestra el modal de fin de juego y llama a la función que guarda la información del juego
   */
  const handleFinish = () => {
    setShowFinish(true);
    clearInterval(interval);
    clearTimeout(timeOut);
    saveGame();
  }

  /**
   * Función que guarda la información del juego
   * @function saveGame
   * @returns {void}
   * @memberof WithImages
   * @description Guarda la información del juego en la base de datos
   */
  const saveGame = async() => {
      try{
        const game = (await AsyncStorage.getItem('game')) || "[]";
        const gameJson = JSON.parse(game);
        const newGame = {
          gameType: 'withImages',
          score: score,
          incorrect: errors,
          corrects: score,
          date: new Date(),

        }; // Objeto con la información del juego
        const Jugadas = plays; // Array con las jugadas del juego
        gameJson.push(newGame);
        await AsyncStorage.setItem('game', JSON.stringify(gameJson));
        console.log('Juego guardado');
        console.log("Partida: ", newGame)
        console.log("Jugadas: ", plays)
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <View style={globalStyles.whitecontainer}>
      {/* Modal con el resultado del juego */}
      {showFinish && (
        <FinishModal 
          showFinish={showFinish} 
          score={score} 
          closeModal={()=>navigation.navigate('MainPage')} 
          startGame={()=>{
            setShowFinish(false);
            setScore(0);
            setErrors(0);
            setTimerNextLevel(3);
            setTimerFlipCard(3);
            setShowInstructions(true);
            setFeedbackMessage('');
            generateNewImages(); 
            setTime(0);
            setPlays([]);
          }} 
          />
      )}
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
              onPress={() => {
                setShowInstructions(false);
                timeOut = setTimeout(() => {
                  handleFinish();
                }, 4*60*1000); // 4 minutos de juego
                interval = setInterval(() => {
                  setTime(prevTime => prevTime + 1);
                }, 1000);
              }}
              width="40%"
            />
          </View>
        </Modal>
      )}

      {/* Iconos superiores */}
      <TouchableOpacity
        onPress={() => handleFinish()}
        style={[globalStyles.supder, { borderWidth: 2, borderRadius: 18 }]}>
        <FontAwesomeIcon icon={faXmark} size={20} color={colors.black} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowInstructions(true)}
        style={globalStyles.supizq}>
        <FontAwesomeIcon icon={faCircleQuestion} size={20} color={colors.black} />
      </TouchableOpacity>

      {/* Resultado de la seleccion */}
      <Text style={[globalStyles.resultText,{marginBottom:100}]}>{feedbackMessage}</Text>

      {/* Lista de cartas */}
      {/* Muestre un view cuando hay feedback y otro cuando no*/}
      {feedbackMessage == '' ? (
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
      ):(
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {cards.map((imagen, index) => (
          <View
            key={index}
            style={globalStyles.card}
          >
            {imagen == targetImage ?(
              <Image
                style={[globalStyles.tinyLogo, globalStyles.card, {borderColor: 'green'}]}
                source={imagen.path}
                resizeMode="contain"
              />
            ):(
              <Image
              style={[globalStyles.tinyLogo, globalStyles.card, {borderColor: 'red'}]}
              source={imagen.path}
              resizeMode="contain"
            />
            )}
          </View>
        ))}
      </View>
      )}
      

      <View style={{ marginVertical: 10 }} />

      {/* Contador de segundos hasta voltear las cartas */}
      {showTimer && (
        <Text style={globalStyles.resultText}>{timerFlipCard}</Text>
      )}


      {/* Boton de Inicio */}
      {!userReady && !showCards && (
        <CustomButton title="Iniciar" onPress={startNewLevel} width="30%" height={45} />
      )}

      {/* Pregunta por la posición de la tarjeta */}
      {userReady && targetImage && (
          <Text style={globalStyles.text}>¿Dónde estaba esta tarjeta?</Text>
      )}

      {/* Tarjeta a seleccionar */}
      {userReady && targetImage && (
          <Image
            style={[{ alignSelf: 'center' }, globalStyles.card]}
            source={targetImage.path}
            resizeMode="contain"
          />
      )}

      {/* Modal FeedBack */}
      {/* <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={globalStyles.resultText}>{feedbackMessage}</Text>
            <Image
              style={[{ alignSelf: 'center' }, globalStyles.card]}
              source={targetImage.path}
              resizeMode="contain"
            />
            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={[{color: 'white', fontSize:24}]}>Siguiente Nivel</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: 'orange',
  },
});

export default WithImages;