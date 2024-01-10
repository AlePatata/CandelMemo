import React, {useState, useRef} from 'react';
import { View, Text, Animated} from 'react-native';
import CustomButton from './buttons/button';
import globalStyles from '../styles/globalStyles';


const MainPage = ({ navigation }) => {
  
  const animatedValue = useRef(new Animated.Value(0)).current;

  return (
    <View style={globalStyles.whitecontainer}>
      <Text style={globalStyles.title}>¡Bienvenido a MEMO!</Text>
      <Animated.View style={{
                opacity: animatedValue, // por ejemplo, animar la opacidad
                transform: [
                    {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 10], // animar en el eje Y de 0 a 100
                    }),
                    },
                ],
                }}>
                {<Text style={globalStyles.text}>Cuando hayas memorizado las tarjetas pulsa "Estoy listo"</Text>}
            </Animated.View>
      
      <CustomButton
        title="Jugar"
        onPress={() => {
          navigation.navigate('WithImages')
        }}
        width='70%'
      />
      <View style={{ marginVertical: 10 }} /> 
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