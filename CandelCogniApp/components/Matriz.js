import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text } from 'react-native';
import globalStyles from './../styles/globalStyles';
import { View, TouchableHighlight } from 'react-native';
import colors from './../styles/colors';

/** Image es una lista compuesta por una id, ruta de acceso, nombre, ancho y alto*/
const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"target", "size_w":300, "size_h":300};

/** Matriz contiene la visualización de las imágenes y su respectivo orden en la pantalla,
 * depende de múltiples variables para su correcto funcionamiento:
 * cards: List[image] lista de imágenes a mostrar, con un tamaño entre 3 y 6 elementos
 * handleCardClick: Function([Int]) función que se ejecuta al hacer click en una de las imágenes
 * feedbackMessage: String mensaje de retroalimentación al usuario
 * userReady: Boolean indica si el usuario ya puede hacer click en las imágenes
 * difficult: Int dificultad del juego, determina si es momento de aumentar las cantidad de cards
 * targetImage: image imagen que se debe encontrar
 * showInstructions: indica si se debe mostrar el tutorial
 * qcards: lista de imágenes que se deben mostrar en la matriz, escencialmente lo mismo que cards
 */

const Matriz = ({cards, handleCardClick, feedbackMessage, userReady, difficult, targetImage, showInstructions, qcards}) => {

    /* Card es un componente que conforma la estructura de una carta, con una imagen en la parte frontal y otra en la parte trasera
    * Además, tiene un efecto de animación que permite voltear la carta cada vez que se muestra por defecto
    * y sin animación cuando se le agrega el campo 'startAnimation = false'
    * 
    * cardStyle permite poder configurar el estilo de la carta, como el color del borde cuando se quiere mostrar el feedback
    */
    const Card = ({image, back, cardStyle, startAnimation = true}) => {
        const flipAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0
    
        // Start the animation on mount
        useEffect(() => {
          if (startAnimation) {
            Animated.timing(
                flipAnim,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }
            ).start();
          }
        }, [cards], startAnimation);
    
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

    const chunkCards = (cards) =>{
        const result = []
        
        for(let i=0; i<cards.length; i+=2){
            result.push(cards.slice(i,i+2));
        }
        
        return result
    }

  /** Matriz de imagenes, se terminara mas tarde */
  
    return (
        <>
      <View style={{ flexDirection: 'column', alignItems: 'center'}}>
        {chunkCards(cards).map((row, rowIndex)=>(
          <View key={rowIndex} style={{ flexDirection: 'row', alignItems: 'center'}}>
            {row.map((column, columnIndex)=>(
              <TouchableHighlight
                underlayColor={colors.white}
                key={columnIndex}
                onPress={() => {if(userReady && feedbackMessage === '' ) handleCardClick(columnIndex+rowIndex*2) }}>

                {feedbackMessage === '' ? (
                  userReady ? (<Card image={column} back={withoutImage} />) : (<Card image={column} back={column} startAnimation={false} />)
                
                ) : (   
                  (qcards[columnIndex+rowIndex*2].id === targetImage.id ? (
                    <Card image={withoutImage} back={column} cardStyle={[globalStyles.card, {borderColor:colors.green}] }/>
                  ) : ( 
                      <Card image={withoutImage} back={column} cardStyle={[globalStyles.card, {borderColor:colors.red}] }/>
                  ))
                )}
              </TouchableHighlight>
            ))}
          </View>
        ))}
      </View>
      {difficult < 3 && (
        <View style={{ marginVertical: 10 }} />
      )} 

      {/* Contador de segundos hasta voltear las cartas */}
      

      {/* Pregunta por la posición de la tarjeta */}
      {!showInstructions && (userReady) && targetImage && (
        <View style={{ marginTop: 10}}>
          {feedbackMessage === '' && <Text style={globalStyles.text}>¿Dónde estaba esta tarjeta?</Text>}
          
          <View style={{ marginTop: '0%', alignSelf: 'center'}}>
          <Card image={withoutImage}  back={targetImage} startAnimation={userReady} />
          </View>
          
        </View>
      )}
        </>
    )
    
  }
export default Matriz;

