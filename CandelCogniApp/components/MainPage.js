import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './buttons/button'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

const MainPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a *nombreDelJuego*!</Text>
      
      <CustomButton
        title="Jugar"
        onPress={() => navigation.navigate('WithImages')}
        
      />
    </View>
  );
};

export default MainPage;