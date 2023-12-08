import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

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
      <Text style={styles.text}>¡Bienvenido a Mi Aplicación!</Text>
      <Button
        title="Ir a la pantalla Principal"
        onPress={() => navigation.navigate('Game')}
      />
    </View>
  );
};

export default MainPage;