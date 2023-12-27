import React from "react";
import { View, StyleSheet } from "react-native";
import {useAnimatedStyle, useSharedValue, withSpring, ReduceMotion} from "react-native-reanimated";
import customIcons from "./icons/customIcons";
import IconButton from "./botones/iconButton";

/**
 * Matriz Component
 * component that shows the matrix of icons
 * @param {*} correctAnswer array of icons
 * @param {*} setUserAnswer function that sets the user answer
 * @param {*} checkAnswerController function that checks the user answer
 * @example
 *  <Matriz
 *    correctAnswer={correctAnswer}
 *    setUserAnswer={setUserAnswer}
 *    checkAnswerController={checkAnswer}
 *  />
 * 
 */
const Matriz = ({correctAnswer, setUserAnswer, checkAnswerController}) => {
    const rows = 3; // Número de filas
    const columns = 3; // Número de columnas
    const translationX = useSharedValue(-100); // Valor compartido para la posición en el eje X

    const animatedStyleMatriz = useAnimatedStyle(() => {
        return {
          transform: [{translateX: translationX.value}],
          height: 55,
        };
    });

    /**
     * Function that makes the matrix appear
     * @function aparecerMatriz
     * @memberof Matriz
     */
    function aparecerMatriz() {
        translationX.value = withSpring(0, {
          mass: 1,
          damping: 9,
          stiffness: 240,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
          reduceMotion: ReduceMotion.System,
        });
    }
    /**
     * Function that makes the matrix disappear
     * @function desaparecerMatriz
     * @memberof Matriz
     */
    function desaparecerMatriz() {
        translationX.value = -100;
    }

    /**
     * Function that divides an array into chunks
     * @function chunkArray
     * @memberof Matriz
     * @param {Array} array array to divide
     * @param {Number} chunkSize size of the chunks
     * @returns {Array} array of arrays
     */
    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };
    

    /**
     * Function that checks the user answer
     * @function checkAnswer
     * @memberof Matriz
     * @param {String} option option selected by the user
     */
    const checkAnswer = option => {
        desaparecerMatriz();
        checkAnswerController(option);
    }
    aparecerMatriz();
    return (
        /* Muestra la matriz de figuras */
        <View style={styles.optionsContainer}>
        {chunkArray(correctAnswer, columns).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.optionRow}>
            {row.map((item, columnIndex) => (
              <IconButton 
                key={columnIndex}
                icon={customIcons[item].icon} 
                color={customIcons[item].color} 
                size={customIcons[item].size} 
                style={animatedStyleMatriz} // aqui ta el bug
                action={() => {
                  checkAnswer(customIcons[item].iconName);
                  setUserAnswer(customIcons[item]);
                }}
              />
            ))}
          </View>
        ))}
      </View>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'column',
        alignSelf: 'center',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }, 
});


export default Matriz;