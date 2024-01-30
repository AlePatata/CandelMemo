import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Timer = ({ time, style, reset, endGame }) => {
  const [seconds, setSeconds] = useState(time);

/*   useEffect(() => {
    setSeconds(time);
  }, [reset]); */

  useFocusEffect(
    useCallback(() => {
      let intervalId;

      if (reset) {
        intervalId = setInterval(() => {
          if (seconds > 0) {
            setSeconds((prevSeconds) => prevSeconds - 1);
          }
          if (seconds === 0) {
            endGame();
          }
        }, 1000);
      }

      return () => clearInterval(intervalId);
    }, [reset, seconds])
  );

  return (
    <View>
      <Text style={style}>
        Tiempo restante: {Math.floor(seconds / 60)}:
        {seconds % 60 >= 10 ? seconds % 60 : '0' + String(seconds % 60)}
      </Text>
    </View>
  );
};

export default Timer;