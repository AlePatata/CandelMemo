import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Easing, Modal } from 'react-native';
import CustomButton from './buttons/button';
import pattern from './images/pattern';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import FinishModal from './FinishModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};

const WithImages = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [targetImage, setTargetImage] = useState(withoutImage);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [plays, setPlays] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCards, setShowCards] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [initPlay, setInitPlay] = useState(false);

  const [timerFlipCard, setTimerFlipCard] = useState(3);
  const [timerNextLevel, setTimerNextLevel] = useState(3);
  let difficult = 1
  let timeOut = null;

  let level = (Math.floor(score / 1) % pattern.length) + 1;
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
        { length: 2+difficult }, //difficult parte en 1 (3 imagenes)
        () => images[Math.floor(Math.random() * images.length)],
      );
    } while (
      randomimages.some(
        (image, index) =>
          randomimages.slice(index + 1).some(otherImage => image.id === otherImage.id),
      )
    );
    setCards(randomimages);
    console.log(randomimages)
    setQCards(randomimages);
    setTargetImage(randomimages[Math.floor(Math.random() * randomimages.length)]);
    setUserReady(false);
  };

  //maneja la seleccion de una carta
  const handleCardClick = clickedIndex => {
    setUserReady(false);
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
      setCorrect(correct + 1);
      console.log("correcto", correct)
      setScore(prevScore => {
        const newScore = prevScore + 1;
        console.log(newScore)
        setFeedbackMessage('¡Correcto!');
        if(newScore > pattern.length){
          difficult = 2;
        } else {
          difficult = 1;
        }
        return newScore;
    });
      setPlays(prevPlays => [...prevPlays, {target: targetImage, selected: qcards[clickedIndex], correct: true}]);
    } else {
      setErrors(prevErrors => prevErrors + 1);
      setScore(prevScore => {
        const newScore = Math.max(0, prevScore - 1)
        console.log(newScore)
        if(newScore > pattern.length){
          difficult = 2;
        } else {
          difficult = 1;
        }
        return newScore
      });
      setFeedbackMessage('¡Incorrecto!');
      setPlays(prevPlays => [...prevPlays, {target: targetImage, selected: qcards[clickedIndex], correct: false}]);
    };
    //Vueve a mostrar las imagenes
    setCards(qcards);
    setTimerFlipCard(3)

    //Espera un moemento antes de volver a generar una nueva lista de imágenes
    setTimeout(() => {
      console.log(score)
      
      generateNewImages() 
      startNewLevel()    
    }, timerNextLevel*1000);
  };

  //Inicia el loop de juego
  const startNewLevel = () => {
    setInitPlay(true)
    setTimerFlipCard(3);

    const interval = setInterval(() => {
      setTimerFlipCard(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setUserReady(true);
          setInitPlay(false)
          clearInterval(interval);
          if (difficult == 1){
            setCards([withoutImage, withoutImage, withoutImage]);
          } else{
            setCards([withoutImage, withoutImage, withoutImage, withoutImage]);
          }
          return prevTime;
        }
      });
    }, 1000);
  };
  const chunkCards =(cards) =>{
    const result = []
    if (cards.length === 3){
      result.push(cards)
    } else {
      for(let i=0; i<cards.length; i+=2){
        result.push(cards.slice(i,i+2));
      }
    }
    return result
  }

  /** Matriz de imagenes, se terminara mas tarde */
  const Matriz = () => {
    if (feedbackMessage == '' ){
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          {chunkCards(cards).map((row, rowIndex)=>(
            <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              {row.map((column, columnIndex)=>(
                <TouchableOpacity
                  key={columnIndex}
                  style={globalStyles.card}
                  onPress={() => {if(userReady) handleCardClick(columnIndex+rowIndex*2) }}>

                  {column && (
                    <View style={globalStyles.card}>
                    <Image
                      style={globalStyles.tinyLogo}
                      source={column.path}
                      resizeMode="contain"
                    />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          {chunkCards(cards).map((row, rowIndex)=>(
            <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              {row.map((column, columnIndex)=>(
                <View
                key={columnIndex}
                style={globalStyles.card}
                >
                  {(column) == targetImage ?(
                    <View style={[globalStyles.card,{borderColor: colors.green}]}>
                    <Image
                      style={globalStyles.tinyLogo}
                      source={column.path}
                      resizeMode="contain"
                    />
                    </View>
                  ):(

                    <View style={[globalStyles.card,{borderColor: colors.red}]}>
                    <Image
                      style={globalStyles.tinyLogo}
                      source={column.path}
                      resizeMode="contain"
                    />
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      )
    }
  }


  /**
   * Función que maneja el fin del juego
   * @function handleFinish
   * @returns {void}
   * @memberof WithImages
   * @description Muestra el modal de fin de juego y llama a la función que guarda la información del juego
   */
  const handleFinish = () => {
    setIsFinish(true);
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
              title={'Comenzar'}
              onPress={() => {

                setShowInstructions(false)
                startNewLevel()
                timeOut = setTimeout(()=>{
                  handleFinish()
                }, 4*60*1000); // 4 minutos

              }}
              width="40%"
            />
          </View>
        </Modal>
      )}

      {isFinish &&(
        <FinishModal 
        showFinish={isFinish} 
        score={score} 
        closeModal={()=>navigation.navigate('MainPage')} 
        startGame={()=>{
          setIsFinish(false);
          setScore(0);
          setErrors(0);
          setTimerNextLevel(3);
          setTimerFlipCard(3);
          setShowInstructions(true);
          setFeedbackMessage('');
          generateNewImages(); 
          setPlays([]);
        }} 
        />
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

      {/* mostrar puntaje cuando feedback no esta vacio */}
      {feedbackMessage != '' && (
        <View style={{ flexDirection: 'row', 
        alignItems: 'center',
        flex: 1, 
        position: 'absolute', 
        zIndex: 1,
        top: '5%',
        right:'5%', }}>
          <Text style={globalStyles.text}>Puntaje: </Text>
          <Text style={globalStyles.resultText}>{score}</Text>
        </View>
      )}

      {/* Resultado de la seleccion */}
      <Text style={globalStyles.resultText}>{feedbackMessage}</Text>


      <Matriz />

      <View style={{ marginVertical: 10 }} />

      {/* Contador de segundos hasta voltear las cartas */}
      {initPlay && (
        <Text style={globalStyles.resultText}>{timerFlipCard}</Text>
      )}

      {/* Pregunta por la posición de la tarjeta */}
      {userReady && targetImage && (
        <View style={{ marginTop: '0%' }}>
          <Text style={globalStyles.text}>¿Dónde estaba esta tarjeta?</Text>
          
          <View style={[globalStyles.card,{ alignSelf: 'center' }]}>
          <Image
            style={globalStyles.tinyLogo}
            source={targetImage.path}
            resizeMode="contain"
          />
          </View>
        </View>
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
      )</Modal>*/}
    </View>
  );
};

export default WithImages;