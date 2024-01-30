import React, {useState, useRef, useEffect} from 'react';
import { View, Text, Animated} from 'react-native';
import CustomButton from './buttons/button';
import globalStyles from '../styles/globalStyles';

/** Página principal de esta apk, finalmente no se utiliza en la CandelApp */

const MainPage = ({ navigation }) => {
  
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2*1000, 
      useNativeDriver: false, 
    }).start();
  }, []);


  return (
    <View style={globalStyles.whitecontainer}>
      <Text style={globalStyles.title}>¡Bienvenido a MEMO!</Text>
      <Animated.View style={{
                opacity: animatedValue, 
                transform: [
                    {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0], 
                    }),
                    },
                ],
                }}>
                {<Text style={globalStyles.text}>Mira con atención, recuerda con fuerza, ¡y recupérate ganando!</Text>}
            </Animated.View>
      {/** Conecta la funcionalidad general y el tutorial por 2 botones */}
      <CustomButton
        title="Jugar"
        onPress={() => {
          navigation.navigate('WithImages')
        }}
        width='70%'
      />
      <View style={{ marginVertical: 10 }} /> 
      {/** Con la última modificación del tutorial (modal) ya no es necesario redirigirse a Tutorial.js */}
      <CustomButton
        title="¿Cómo jugar?"
        onPress={() => navigation.navigate('Tutorial')}
        width='60%'
        height={50}
      />
    </View>
  );
};

export default MainPage;