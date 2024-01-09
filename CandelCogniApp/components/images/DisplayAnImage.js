import React, { useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const DisplayAnImage = ({ source , onPress }) => {
  const imageSource = source ? source : require('../../assets/target.png');
  const backImageSource = require('../../assets/target.png'); // Reemplaza con la imagen de la parte posterior de la carta


  // Utiliza useRef para crear referencias a las animaciones
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    // Configura la animación de rotación
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false, // Necesario para android
    }).start(() => {
      // Después de completar la primera mitad de la animación, vuelve a 0 grados
      flipAnimation.setValue(0);
    });
  };

  // Establece la rotación en el estilo del componente Image
  const interpolatedRotateAnimation = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const rotateStyle = {
    transform: [{ rotateY: interpolatedRotateAnimation }],
  };

  return (
    <View style={globalStyles.container}>
      <TouchableOpacity onPress={onPress}>
        <Animated.View style={[globalStyles.cardWrapper, rotateStyle]}>
          <Image
            style={[globalStyles.tinyLogo, globalStyles.card, rotateStyle]}
            source={imageSource}
            resizeMode="contain"
          />
          <Image
            style={[globalStyles.tinyLogo, globalStyles.card, rotateStyle]}
            source={backImageSource}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};



export default DisplayAnImage;

