import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import pattern from './images/pattern';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCircleQuestion} from '@fortawesome/free-solid-svg-icons';
import FinishModal from './FinishModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timer from './elementos/timer';
import Tutorial from './Tutorial';
import Matriz from './Matriz';

// Imagen de '?'
const withoutImage = {id:0,"path":require("./../assets/target.png"), "name":"target"};

/** WithImages es la lógica principal del juego, se encarga de generar las imágenes, 
 * manejar los eventos de selección de imágenes y guardar la información del juego
*/ 
const WithImages = ({ navigation }) => {
  // Variables que guardarán las tarjetas
  const [cards, setCards] = useState([]);
  const [qcards, setQCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [targetImage, setTargetImage] = useState(withoutImage);

  // Cantidades de aciertos, errores y jugadas. Puntuación = aciertos - errores
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [plays, setPlays] = useState([]);

  // Mensaje de retroalimentación
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Estados para terminar el juego, definir cuando el usuario puede escoger una carta y para mostrar las instrucciones/tutorial
  const [isFinish, setIsFinish] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Temporizadores para voltear las cartas y para el siguiente nivel
  const [timerFlipCard, setTimerFlipCard] = useState(3);
  const [timerNextLevel, setTimerNextLevel] = useState(3);
  let timeOut = null;
  let remainingTime = 4*60*1000; // 4 minutos

  // Nivel: categoría de la imagen y Dificultad: cantidad de imágenes a mostrar
  let level = (Math.floor(score / 1) % pattern.length) + 1;
  let difficult = 1; // 3 cartas


  //genera la primera lista de imagenes
  useEffect(() => {
    generateNewImages();
  }, []);

  // Genera una lista de imagenes dependiendo de la dificultad que le corresponde
  const generateNewImages = () => {
    setFeedbackMessage('');
    setUserReady(false); // El usuario no puede seleccionar una carta
    const images = pattern.find(item => item[0] === level)[1];
    let randomimages = [];
    do {
      randomimages = Array.from( // Genera un array de imagenes
        { length: 2 + difficult }, // difficult parte en 1 (3 imagenes)
        () => images[Math.floor(Math.random() * images.length)],
      );
    } while (
      randomimages.some( // Mientras cada imagen no se repita
        (image, index) =>
          randomimages.slice(index + 1).some(otherImage => image.id === otherImage.id),
      )
    );
    setCards(randomimages); // Guarda las imagenes
    console.log(
      '\n----------------IMAGES----------------\n ',
      cards,
    );
    setQCards(randomimages);
    setTargetImage(randomimages[Math.floor(Math.random() * randomimages.length)]); // Escoge una imagen al azar entre las mostradas
  };

  // Maneja la seleccion de una carta
  const handleCardClick = clickedIndex => {
    setUserReady(false); // El usuario no puede seleccionar una carta
    console.log(
      '\n----------------SELECTED-IMAGE----------------\n ',
      qcards[clickedIndex],
    );
    console.log(
        '\n----------------TARGET-IMAGE----------------\n ',
        targetImage,
    );

    // Verificar si el índice seleccionado es correcto
    if (qcards[clickedIndex].id === targetImage.id) {
      setCorrect(correct + 1);
      setFeedbackMessage('¡Correcto!');
      // setScore resuelve un problema de delay en la actualización del puntaje
      setScore(prevScore => {
        const newScore = prevScore + 1;
        // Ajusta la dificultad dependiendo del puntaje
        if(newScore > 3*pattern.length){
          difficult = 4;
        } else if(newScore > 2*pattern.length){
          difficult = 3;
        } else if(newScore > pattern.length){
          difficult = 2;
        } else {
          difficult = 1;
        }
        return newScore;
      });
      setPlays(prevPlays => [...prevPlays, {target: targetImage, selected: qcards[clickedIndex], correct: true}]);
    } else {
      setErrors(prevErrors => prevErrors + 1);
      setFeedbackMessage('¡Incorrecto!');
      // setScore resuelve un problema de delay en la actualización del puntaje
      setScore(prevScore => {
        const newScore = Math.max(0, prevScore - 1)
        if(newScore > 3*pattern.length){
          difficult = 4;
        } else if(newScore > 2*pattern.length){
          difficult = 3;
        } else if(newScore > pattern.length){
          difficult = 2;
        } else {
          difficult = 1;
        }
        return newScore
      });
      setPlays(prevPlays => [...prevPlays, {target: targetImage, selected: qcards[clickedIndex], correct: false}]);
    };

    // Espera un momento antes de volver a generar una nueva lista de imágenes
    setTimeout(() => {
      generateNewImages() 
      startNewLevel()    
    }, timerNextLevel*1000);
  };

  // Inicia el loop de juego e inicia la cuenta regresiva 
  const startNewLevel = () => {
    setTimerFlipCard(3);

    // Inicia el temporizador para voltear las cartas
    const interval = setInterval(() => {
      setTimerFlipCard(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setUserReady(true);
          clearInterval(interval);
          return prevTime;
        }
      });
    }, 1000);
  };

  /** HandleFinish maneja el fin del juego donde guarda el juego,
   *  para el tiempo y señala que el juego termino en el booleano isFinish
  */
  const handleFinish = () => {
    setIsFinish(true);
    clearTimeout(timeOut);
    saveGame();
  }

  /**  Función que guarda la información del juego en la base de datos
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
      {/* Modal con las instrucciones/tutorial */}
      {showInstructions && (<Tutorial closeInstructions={()=>{
        setShowInstructions(false)
        startNewLevel();
        timeOut = setTimeout(()=>{
          handleFinish()
        }, remainingTime); // 4 minutos
      }} />)}
      
      {/* Modal de fin de juego */}
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
      {!showInstructions && (<TouchableOpacity
        onPress={() => {
          //se muestra el modal del tutorial
          setShowInstructions(true)
          clearTimeout(timeOut); // Pausa el temporizador
        }}
        style={globalStyles.supizq}>
        <FontAwesomeIcon icon={faCircleQuestion} size={20} color={colors.black} />
      </TouchableOpacity>)}
      <View style={{position: 'absolute', top: '3%', zIndex:1}}>
        {/* Hay un delay con la visualización del temporizador pero por detrás marca correctamente el tiempo real */}
        <Timer 
          style={{ color: colors.black, fontSize: 20, textAlign: 'center', position: 'relative', zIndex:1 }} 
          time={4*60} // 4 minutos
          endGame={handleFinish} 
          reset={!showInstructions}
        />
      </View>

      {/* Mostrar puntaje cuando se da el feedback */}
      {feedbackMessage != '' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, position: 'absolute', zIndex: 1, top: '5%', right:'5%', }}>
          <Text style={globalStyles.text}>Puntaje: </Text>
          <Text style={globalStyles.resultText}>{score}</Text>
        </View>
      )}

      {/* Matriz de imagenes */}
      <View style={{position: 'absolute', top: '15%', alignItems: 'center', zIndex:1}}>
        {!showInstructions && (
        <Matriz cards={cards} handleCardClick={(e)=>handleCardClick(e) } userReady={userReady} feedbackMessage={feedbackMessage}
        targetImage={targetImage} difficult={difficult} showInstructions={showInstructions} qcards={qcards}/> )}
      </View>

      {!userReady && feedbackMessage === '' && (
        <Text style={[globalStyles.resultText, {position:'absolute', bottom: '20%', zIndex:1}]}>{timerFlipCard}</Text> )}

      {/* Resultado de la seleccion */}
      {feedbackMessage != '' && (
        <Text style={[globalStyles.resultText, {position: 'relative', top: '20%'}]}>{feedbackMessage}</Text> )}
    </View>
  );
};

export default WithImages;