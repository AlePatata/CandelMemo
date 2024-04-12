import React, {useRef, useState, useEffect} from "react";
import TutorialModalStyle from '../styles/tutorialModalStyle';
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faArrowLeft, faArrowRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import  pattern  from "./images/pattern";
import CustomButton from "./buttons/button";

// Imagen de '?'
const withoutImage = {id:0,"path":require("./../assets/target.png"), "name":"target"};


/** Tutorial Component es el componente que se muestra al iniciar el juego y que se puede llamar a través del botón de ayuda
 * Este comprende una serie de pasos que explican al usuario cómo jugar, en forma de slides interactivas (similar al RALO)
 * 
 * @closeInstructions {*} Función que se llama al cerrar el tutorial y comprende una serie de instrucciones descritas en WithImages.js
 * @returns la visualización del tutorial
 */
const Tutorial = ({closeInstructions}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  const [modalProgress, setModalProgress] = useState(1);

  // Estado que determina cuando "voltear" las cartas
  const [showTutorialCards, setShowTutorialCards] = useState(false);
  const [tutorialCards, setTutorialCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [qTutorialCards, setQTutorialCards] = useState([withoutImage, withoutImage, withoutImage]);
  const [targetTutorialImage, setTargetTutorialImage] = useState(withoutImage); // Imagen objetivo

  // Animación cuando aparece el modal con las instrucciones
  const startAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);
    
  // Función que divide las cartas en filas de 2 (reutilizada de WithImages.js)
  const chunkCards = (cards) =>{
    const result = []
      for(let i=0; i<cards.length; i+=2){
      result.push(cards.slice(i,i+2));
      }
    return result
  }

  // Función que genera una lista de imágenes para el tutorial, todas de nivel 1
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
    do { // Genera una lista de imágenes aleatorias de largo l
      randomimages = Array.from(
        { length: l}, 
        () => images[Math.floor(Math.random() * images.length)],
      );
    } while ( // mientras ninguna imagen se repita
      randomimages.some(
        (image, index) => randomimages.slice(index + 1).some(otherImage => image.id === otherImage.id),
      )
    );
    // Asigna las imágenes a tutorialCards y qTutorialCards correspondientes
    setTutorialCards(randomimages);
    setQTutorialCards(randomimages);
    // Asigna una imagen objetivo aleatoria entre las imágenes de tutorialCards
    setTargetTutorialImage(randomimages[Math.floor(Math.random() * randomimages.length)]);
    // Suele tener un retraso al imprimir
    console.log('id Tutorial Cards: ')
    console.log(tutorialCards.map(card => card.id));
    console.log('id Target Tutorial Image: ')
    console.log(targetTutorialImage.id);
  };
    
  
  const TutorialMatriz = () => {
    if (showTutorialCards){
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center'}}> 
          {chunkCards(tutorialCards).map((row, rowIndex)=>(
            <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center'}}>
              {row.map((column, columnIndex)=>( //column es la imagen, columnIndex es el índice de la imagen
                <TouchableOpacity
                  key={columnIndex}
                  onPress={() => {if((qTutorialCards[columnIndex+rowIndex*2].id === targetTutorialImage.id) /*rowIndex es el ajuste del indice cuando se encuentra en una fila superior*/
                     && modalProgress !== 2 && modalProgress !== 6 && modalProgress !== 10) {
                  setModalProgress(modalProgress+1) // Avanzar en el tutorial
                  setTutorialCards(qTutorialCards)
                  setShowTutorialCards(false);}   // Voltear cartas
                  }}>

                  {column && ( // Si la imagen existe se muestra
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
                // sección de Feedback, controla los colores de las cartas al volver a mostrarlas
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
    /* Modal de instrucciones, se divide en 13 slides, controladas por modalProgress, el cual toma los siguientes valores:
    * 1: Instrucciones generales
    * 2: Mostrar 3 imágenes
    * 3: Preguntar por la ubicación de una de ellas (es posible retroceder)
    * 4: Felicitaciones, avanzar al siguiente nivel
    * 5: Slide de transición (para evitar delay al aumentar cantidad de imágenes)
    * 6: Mostrar 4 imágenes
    * 7: Preguntar por la ubicación de una de ellas (es posible retroceder)
    * 8: Felicitaciones, avanzar al siguiente nivel
    * 9: Slide de transición (para evitar delay al aumentar cantidad de imágenes)
    * 10: Mostrar 5 imágenes
    * 11: Preguntar por la ubicación de una de ellas (es posible retroceder)
    * 12: Felicitaciones, terminar el tutorial
    * 13: Botones para repetir el tutorial o empezar el juego
    */
      <View style={TutorialModalStyle.container}>
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
          }}
        >
        <View style={[TutorialModalStyle.modalContainer, {width: 600}]}>
          <View style={{position: "absolute", right: '2%', top: '2%', zIndex:1}}>
          <TouchableOpacity 
          onPress={() => {
              closeInstructions();
              setModalProgress(1);
            }} 
            style={[globalStyles.supder, {borderWidth: 2, borderRadius: 18}]}>
            <FontAwesomeIcon icon={faXmark} size={20} color={colors.black}/>
          </TouchableOpacity>
          </View>
          {modalProgress === 1 && (
            <>
          <Text style={[TutorialModalStyle.tutorialTitle, {fontSize: 40}]}>Instrucciones</Text>
          <Text style={[TutorialModalStyle.tutorialText, {padding: 10, fontSize:23}]}>
            Este es un juego de <Text style={{fontWeight: '900'}}>memoria</Text>. Se mostrarán imágenes, 
            de las cuales debes recordar su <Text style={{fontWeight: '900'}}>ubicación</Text>, 
            para luego <Text style={{fontWeight: '900'}}>seleccionar</Text> la imagen correcta.
          </Text>
          <View style={{margin: 30, marginBottom: 20}} />
          <TouchableOpacity
          style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
          onPress={() => {
            setModalProgress(modalProgress+1) // Avanzar en el tutorial;
            generateNewTutorialImages();
            setShowTutorialCards(true);
          }}>
            <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
          </TouchableOpacity>
          </>
          )}
          {modalProgress === 2 && (
            <>
            <Text style={[TutorialModalStyle.tutorialText, {padding: 15, fontSize:23}]}>
            Te mostraremos 3 imágenes
            </Text>
            <TutorialMatriz />
            <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
            Recuerda su <Text style={{fontWeight:'bold'}}>posición</Text> 
            </Text>
            <View style={{margin: 30, marginBottom: 20}} />
          <TouchableOpacity
          style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
          onPress={() => {
            setModalProgress(modalProgress+1) // Avanzar en el tutorial;
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
            Puedes <Text style={{fontWeight:'bold'}}>retroceder</Text> si lo necesitas
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
          <Text style={[TutorialModalStyle.tutorialTitle, {margin:'10%'}]}>Excelente! </Text>
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
            setModalProgress(modalProgress+1) // Avanzar en el tutorial;
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
            <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
            <Text style={TutorialModalStyle.tutorialTitle}> Muy bien!  </Text>  {'\n\n'} Has entendido cómo jugar, {'\n\n'}
            Ahora subiremos la <Text style={{fontWeight:'bold'}}>dificultad</Text> 
            </Text>
            <View style={{marginBottom: 20}} />
            
            
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1) // Avanzar en el tutorial;
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
            <Text style={[TutorialModalStyle.tutorialText, {padding: 15, fontSize:23}]}>
            Te mostraremos 4 imágenes
            </Text>
            <TutorialMatriz />
            
            <Text style={[TutorialModalStyle.tutorialText, {padding: 10}]}>
            Recuerda su <Text style={{fontWeight:'bold'}}>posición</Text>
            </Text>
            <View style={{margin: 30, marginBottom: 20}} />
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1) // Avanzar en el tutorial;
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
          <Text style={[TutorialModalStyle.tutorialTitle, {margin:'15%'}]}>¡Buenísimo!</Text>
          <TutorialMatriz />
          
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
            setModalProgress(modalProgress+1) // Avanzar en el tutorial;
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
            <Text style={[TutorialModalStyle.tutorialText, {padding: 10, fontSize: 24}]}>
            <Text style={TutorialModalStyle.tutorialTitle}> ¡Genial!  </Text>{'\n\n'}Subiremos la <Text style={{fontWeight:'bold'}}>dificultad</Text> una vez más
            </Text>
            <View style={{marginBottom: 20}} />
            
            <TouchableOpacity
            style={{position: "absolute", right: '5%', bottom: '3%', zIndex:1}}
            onPress={() => {
              setModalProgress(modalProgress+1) // Avanzar en el tutorial;
              setTutorialCards([withoutImage, withoutImage, withoutImage, withoutImage, withoutImage]);
              generateNewTutorialImages();
            }}>
              <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
            </TouchableOpacity>
          </>
          )}    
          {modalProgress === 10 && (
            <>
            <Text style={[TutorialModalStyle.tutorialText, {padding: 15, fontSize:23}]}>
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
              setModalProgress(modalProgress+1) // Avanzar en el tutorial;
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
          <Text style={[TutorialModalStyle.tutorialTitle, {margin:'20%'}]}>¡Buenísimo!</Text>
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
            setModalProgress(modalProgress+1) // Avanzar en el tutorial;
            setShowTutorialCards(true);
          }}>
            <FontAwesomeIcon icon={faArrowRight} size={40} color={colors.black} />
          </TouchableOpacity>
          
          </>
          )}  
          {modalProgress === 13 && (
            <>
          <Text style={[TutorialModalStyle.tutorialTitle, {margin:'10%'}]}>¡Felicidades! Terminaste el tutorial</Text>
          <Text style={[TutorialModalStyle.tutorialText, {padding: 10, fontSize: 24}]}>
            Ahora puedes elegir si quieres <Text style={{fontWeight:'bold',fontSize:26}}>Repetir</Text> el tutorial o <Text style={{fontWeight:'bold', fontSize:26}}>Empezar</Text> el juego
          </Text>
          
          <View style={{margin: 30, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}} >
          <CustomButton 
          title={'Repetir Tutorial'}
          onPress={() => {
            generateNewTutorialImages();
            setModalProgress(1);
            generateNewTutorialImages();
            setShowTutorialCards(true);
          }} 
          width='55%'/>
          <View style={{margin:20}} />
          <CustomButton 
          title={'Empezar'}
          onPress={() => {
              closeInstructions();
              setModalProgress(1);
          }} 
          width='45%'/>
          </View>
          </>
          )}  
        
        </View>
        </Animated.View>
      </View>
    );
}

export default Tutorial;