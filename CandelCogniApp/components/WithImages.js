import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Easing, Animated } from 'react-native';
import CustomButton from './buttons/button';
import pattern from './images/pattern';
import globalStyles from '../styles/globalStyles';
import TutorialModalStyle from '../styles/tutorialModalStyle';
import colors from '../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faCircleQuestion, faArrowLeft, faArrowRight, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
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
  
  const [isFinish, setIsFinish] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [initPlay, setInitPlay] = useState(false);

  const [timerFlipCard, setTimerFlipCard] = useState(3);
  const [timerNextLevel, setTimerNextLevel] = useState(3);
  let difficult = 1
  let timeOut = null;

  let level = (Math.floor(score / 1) % pattern.length) + 1;

  const [showTutorialCards, setShowTutorialCards] = useState(false);
  const [modalProgress, setModalProgress] = useState(1);
  const [tutorialCards, setTutorialCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [qTutorialCards, setQTutorialCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [targetTutorialImage, setTargetTutorialImage] = useState(withoutImage);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const Card = ({ image, back = newBack , cardStyle}) => {
    const flipAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0

    // Start the animation on mount
    useEffect(() => {
        Animated.timing(
            flipAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }, [flipAnim]);

    const flipToBackStyle = {
        transform: [
            { rotateY: flipAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
            }) }
        ]
    };

    const flipToFrontStyle = {
        transform: [
            { rotateY: flipAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['180deg', '0deg']
            }) }
        ]
    };

    return (
        <>
            <Animated.View style={[globalStyles.card, flipToBackStyle,globalStyles.cardFront]}>
                <Image
                    style={[globalStyles.tinyLogo,]}
                    source={image.path}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.View style={[globalStyles.card, flipToFrontStyle,globalStyles.cardBack,cardStyle]}>
                <Image
                    style={[globalStyles.tinyLogo,{backfaceVisibility: 'hidden'}]}
                    source={back.path}
                    resizeMode="contain"
                />
            </Animated.View>
        </>
    );
}

  const startAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  

  //genera la primera lista de imagenes
  useEffect(() => {
    generateNewImages();
    startAnimation();
  }, []);

  useEffect(() => {
    if (showInstructions) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0); // reset the scale value when showInstructions is false
    }
  }, [showInstructions]);

  //genera una lista de imagenes
  const generateNewImages = () => {
    setFeedbackMessage('');
    const images = pattern.find(item => item[0] === level)[1];
    let randomimages = [];
    do {
      randomimages = Array.from(
        { length: 2+ difficult }, //difficult parte en 1 (3 imagenes)
        () => images[Math.floor(Math.random() * images.length)],
      );
    } while (
      randomimages.some(
        (image, index) =>
          randomimages.slice(index + 1).some(otherImage => image.id === otherImage.id),
      )
    );
    setCards(randomimages);
    console.log(randomimages);
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
      setScore(prevScore => {
        const newScore = Math.max(0, prevScore - 1)
        console.log(newScore)
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
      setFeedbackMessage('¡Incorrecto!');
      setPlays(prevPlays => [...prevPlays, {target: targetImage, selected: qcards[clickedIndex], correct: false}]);
    };
    
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
          /*
          if (difficult == 1){
            setCards([withoutImage, withoutImage, withoutImage]);
          } else if (difficult == 2){
            setCards([withoutImage, withoutImage, withoutImage, withoutImage]);
          } else if (difficult == 3){
            setCards([withoutImage, withoutImage, withoutImage, withoutImage, withoutImage]);
          } else{
            setCards([withoutImage, withoutImage, withoutImage, withoutImage, withoutImage, withoutImage]);
          }*/
          return prevTime;
        }
      });
    }, 1000);
  };
  const chunkCards = (cards) =>{
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
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        {chunkCards(cards).map((row, rowIndex)=>(
          <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            {row.map((column, columnIndex)=>(
              <TouchableOpacity
                key={columnIndex}
                onPress={() => {if(userReady && feedbackMessage === '' ) handleCardClick(columnIndex+rowIndex*2) }}>

                {feedbackMessage === '' ? (
                  userReady ? (<Card image={column} back={withoutImage} />) : (<Card image={withoutImage} back={column} />)
                
                ) : (   
                  (qcards[columnIndex+rowIndex*2].id === targetImage.id ? (
                    <Card image={withoutImage} back={column} cardStyle={[globalStyles.card, {borderColor:colors.green}] }/>
                  ) : ( 
                      <Card image={withoutImage} back={column} cardStyle={[globalStyles.card,
                          {borderColor:colors.red}] }/>
                  ))
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    )
    
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

  const generateNewTutorialImages = () => {
    const images = pattern.find(item => item[0] === 1)[1];
    let randomimages = [];
    let l = 3;
    if (modalProgress <= 4){
      l = 3;
    } else if (5 <= modalProgress && modalProgress <= 8){  
      l = 4;
    } else if (9 <= modalProgress){
      l = 5;
    }
    do {
      randomimages = Array.from(
        { length: l}, 
        () => images[Math.floor(Math.random() * images.length)],
      );
    } while (
      randomimages.some(
        (image, index) =>
          randomimages.slice(index + 1).some(otherImage => image.id === otherImage.id),
      )
    );
    setTutorialCards(randomimages);
    setQTutorialCards(randomimages);
    setTargetTutorialImage(randomimages[Math.floor(Math.random() * randomimages.length)]);
    console.log('Tutorial Cards: ')
    console.log(tutorialCards.map(card => card.id));
    console.log('Target Tutorial Image: ')
    console.log(targetTutorialImage.id);
  };
  

  const TutorialMatriz = () => {
    if (showTutorialCards){
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          {chunkCards(tutorialCards).map((row, rowIndex)=>(
            <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              {row.map((column, columnIndex)=>(
                <TouchableOpacity
                  key={columnIndex}
                  style={TutorialModalStyle.card}
                  onPress={() => {if((qTutorialCards[columnIndex+rowIndex*2].id === targetTutorialImage.id) && modalProgress !== 2 && modalProgress !== 6 && modalProgress !== 10) {
                  setModalProgress(modalProgress+1)
                  setTutorialCards(qTutorialCards)
                  setShowTutorialCards(false);}
                  }}>

                  {column && (
                    <View style={TutorialModalStyle.card}>
                    <Image
                      style={TutorialModalStyle.tinyLogo}
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
          {chunkCards(tutorialCards).map((row, rowIndex)=>(
            <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              {row.map((column, columnIndex)=>(
                <View
                key={columnIndex}
                style={TutorialModalStyle.card}
                >
                  {(column.id) == targetTutorialImage.id ?(
                    <View style={[TutorialModalStyle.card,{borderColor: colors.green}]}>
                    <Image
                      style={TutorialModalStyle.tinyLogo}
                      source={column.path}
                      resizeMode="contain"
                    />
                    </View>
                  ):(

                    <View style={[TutorialModalStyle.card,{borderColor: colors.red}]}>
                    <Image
                      style={TutorialModalStyle.tinyLogo}
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


  return (
    <View style={globalStyles.whitecontainer}>
      {/* Modal con las instrucciones */}
      {showInstructions && (
        <View style={TutorialModalStyle.container}>
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
            }}
          >
          <View style={TutorialModalStyle.modalContainer}>
            <View style={{position: "absolute", right: '2%', top: '2%', zIndex:1}}>
            <TouchableOpacity onPress={() => {
              setShowInstructions(false)
              startNewLevel()
              setModalProgress(1)
              
              timeOut = setTimeout(()=>{
                handleFinish()
              }, 4*60*1000); // 4 minutos

              }} style={[globalStyles.supder, {borderWidth: 2, borderRadius: 18}]}>
              <FontAwesomeIcon icon={faXmark} size={20} color={colors.black}/>
            </TouchableOpacity>
            </View>
            {modalProgress === 1 && (
              <>
            <Text style={TutorialModalStyle.tutorialTitle}>Instrucciones</Text>
            <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Este es un juego de <Text style={{fontWeight: '900'}}>memoria</Text>. Se mostrarán imágenes, 
              de las cuales debes recordar su <Text style={{fontWeight: '900'}}>ubicación</Text>, 
              para luego <Text style={{fontWeight: '900'}}>seleccionar</Text> la imagen correcta.
            </Text>
            <View style={{margin: 30, marginBottom: 20}} />
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1);
              generateNewTutorialImages();
              setShowTutorialCards(true);
            }}>
              <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
            </TouchableOpacity>
            </>
            )}
            {modalProgress === 2 && (
              <>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Te mostraremos 3 imágenes
              </Text>
              <TutorialMatriz />
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Recuerda su ubicación
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1);
              setTutorialCards([withoutImage, withoutImage, withoutImage]);
            }}>
              <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
            </TouchableOpacity>
              <TouchableOpacity
              style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress-1);
                setTutorialCards(qTutorialCards);
              }}>
                <FontAwesomeIcon icon={faArrowLeft} size={40} color={colors.black} />
              </TouchableOpacity>
              </>
            )}
            {modalProgress === 3 && (
              <>
              
              <View style={{marginBottom: 20}} />
              
              <TutorialMatriz />  
              <Text style={[TutorialModalStyle.tutorialTitle, {padding: 10}]}>
              ¿Dónde estaba esta imagen?
              </Text>
              <View style={[globalStyles.card,{ alignSelf: 'center' }]}>
              <Image
                style={globalStyles.tinyLogo}
                source={targetTutorialImage.path}
                resizeMode="contain"
              />
              </View>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Puedes volver atrás si lo necesitas
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              <TouchableOpacity
              style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress-1);
                setTutorialCards(qTutorialCards);
              }}>
                <FontAwesomeIcon icon={faArrowLeft} size={40} color={colors.black} />
              </TouchableOpacity>
              
              </>
            )}
            {modalProgress === 4 && (
              <>
            <Text style={[TutorialModalStyle.tutorialTitle, {margin:'10%'}]}>Excelente!</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
              <TutorialMatriz />
            </View>
            <View style={{margin: 30, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}} />
            <TouchableOpacity style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              generateNewTutorialImages();
              setModalProgress(2);
              setShowTutorialCards(true);
            }}>
              <FontAwesomeIcon icon={faArrowRotateLeft} size={40} color={colors.black} />
            </TouchableOpacity>
            
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1);
              setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
              setQTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
              generateNewTutorialImages();
              setShowTutorialCards(true);
            }}>
              <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
            </TouchableOpacity>
            
            </>
            )}
            {modalProgress === 5 && (
              <>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10, margin: 30}]}>
              Muy bien! has entendido cómo jugar
              </Text>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10, margin: 30}]}>
              Ahora subiremos la dificultad
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              
              
              <TouchableOpacity
              style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress+1);
                setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
                setQTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
                generateNewTutorialImages();
              }}>
                <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
              </TouchableOpacity>
            </>
            )}    
            {modalProgress === 6 && (
              <>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10, margin: 30}]}>
              Te mostraremos 4 imágenes
              </Text>
              <TutorialMatriz />
              
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Recuerda su ubicación
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              <TouchableOpacity
              style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress+1);
                setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
              }}>
                <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
              </TouchableOpacity>
              </>
            )}  
            {modalProgress === 7 && (
              <>
              
              <View style={{marginBottom: 20}} />
              
              <TutorialMatriz />  
              <Text style={[TutorialModalStyle.tutorialTitle, {padding: 10}]}>
              ¿Dónde estaba esta imagen?
              </Text>
              <View style={[globalStyles.card,{ alignSelf: 'center' }]}>
              <Image
                style={globalStyles.tinyLogo}
                source={targetTutorialImage.path}
                resizeMode="contain"
              />
              </View>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Puedes volver atrás si lo necesitas
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              <TouchableOpacity
              style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress-1);
                setTutorialCards(qTutorialCards);
              }}>
                <FontAwesomeIcon icon={faArrowLeft} size={40} color={colors.black} />
              </TouchableOpacity>
              
              </>
            )}   
            {modalProgress === 8 && (
              <>
            <Text style={[TutorialModalStyle.tutorialTitle, {margin:'20%'}]}>Buenísimo!</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
              <TutorialMatriz />
            </View>
            <View style={{margin: 30, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}} />
            <TouchableOpacity style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              
              setModalProgress(6);
              setShowTutorialCards(true);
              generateNewTutorialImages();
            }}>
              <FontAwesomeIcon icon={faArrowRotateLeft} size={40} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1);
              setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
              setQTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage]);
              setShowTutorialCards(true);
            }}>
              <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
            </TouchableOpacity>
            
            </>
            )}   
            {modalProgress === 9 && (
              <>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10, margin: 30}]}>
              Muy bien! has entendido cómo jugar
              </Text>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10, margin: 30}]}>
              Ahora subiremos la dificultad
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              
              <TouchableOpacity
              style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress+1);
                setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage, withoutImage]);
                generateNewTutorialImages();
              }}>
                <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
              </TouchableOpacity>
            </>
            )}    
            {modalProgress === 10 && (
              <>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10, margin: 30}]}>
              Te mostraremos 5 imágenes
              </Text>
              <TutorialMatriz />
              
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Recuerda su ubicación
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              <TouchableOpacity
              style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress+1);
                setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage, withoutImage]);
              }}>
                <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
              </TouchableOpacity>
              </>
            )}  
            {modalProgress === 11 && (
              <>
              
              <View style={{marginBottom: 20}} />
              
              <TutorialMatriz />  
              <Text style={[TutorialModalStyle.tutorialTitle, {padding: 10}]}>
              ¿Dónde estaba esta imagen?
              </Text>
              <View style={[globalStyles.card,{ alignSelf: 'center' }]}>
              <Image
                style={globalStyles.tinyLogo}
                source={targetTutorialImage.path}
                resizeMode="contain"
              />
              </View>
              <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
              Puedes volver atrás si lo necesitas
              </Text>
              <View style={{margin: 30, marginBottom: 20}} />
              <TouchableOpacity
              style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
              onPress={() => {
                setModalProgress(modalProgress-1);
                setTutorialCards(qTutorialCards);
              }}>
                <FontAwesomeIcon icon={faArrowLeft} size={40} color={colors.black} />
              </TouchableOpacity>
              
              </>
            )}   
            {modalProgress === 12 && (
              <>
            <Text style={[TutorialModalStyle.tutorialTitle, {margin:'20%'}]}>Buenísimo!</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
              <TutorialMatriz />
            </View>
            <View style={{margin: 30, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}} />
            <TouchableOpacity style={{position: "absolute", left: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              generateNewTutorialImages();
              setModalProgress(10);
              setShowTutorialCards(true);
            }}>
              <FontAwesomeIcon icon={faArrowRotateLeft} size={40} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1);
              setShowTutorialCards(true);
            }}>
              <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
            </TouchableOpacity>
            
            </>
            )}  
            {modalProgress === 13 && (
              <>
            <Text style={[TutorialModalStyle.tutorialTitle, {margin:'20%'}]}>Felicidades! Terminaste el tutorial</Text>
            
            <View style={{margin: 30, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}} >
            <CustomButton 
            title={'Repetir Tutorial'}
            onPress={() => {
              generateNewTutorialImages();
              setModalProgress(1);
              generateNewTutorialImages();
              setShowTutorialCards(true);
            }} 
            width='50%'/>
            <View style={{margin:20}} />
            <CustomButton 
            title={'Empezar'}
            onPress={() => {
              setShowInstructions(false);
            }} 
            width='50%'/>
            </View>
            </>
            )}  
          
          </View>
          </Animated.View>
        </View>
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
      {!showInstructions && (<TouchableOpacity
        onPress={() => setShowInstructions(true)}
        style={globalStyles.supizq}>
        <FontAwesomeIcon icon={faCircleQuestion} size={20} color={colors.black} />
      </TouchableOpacity>)}
      

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
      {feedbackMessage != '' && (
        <Text style={globalStyles.resultText}>{feedbackMessage}</Text>
      )}

      {/* Matriz de imagenes */}
      {!showInstructions && (<Matriz />)}
      

      {difficult < 3 && (
        <View style={{ marginVertical: 10 }} />
      )} 

      {/* Contador de segundos hasta voltear las cartas */}
      {initPlay && (
        <Text style={globalStyles.resultText}>{timerFlipCard}</Text>
      )}

      {/* Pregunta por la posición de la tarjeta */}
      {!showInstructions && userReady && targetImage && (
        <View style={{ marginTop: '0%' }}>
          <Text style={globalStyles.text}>¿Dónde estaba esta tarjeta?</Text>
          
          
          
          <View style={{ marginTop: '0%', alignSelf: 'center'}}>
          <Card image={withoutImage}  back={targetImage} />
          </View>
        </View>
      )}
    </View>
  );

};

export default WithImages;