import React, {useState, useRef, useEffect} from 'react';
import { View, Text, Animated} from 'react-native';
import CustomButton from './buttons/button';
import globalStyles from '../styles/globalStyles';


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