import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const DisplayAnImage = ({ source }) => {
  // Establecer una imagen predeterminada si no se proporciona una fuente
  const imageSource = source ? source : require('../../assets/logo_peq.png');

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={imageSource}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  tinyLogo: {
    width: 90,
    height: 90,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default DisplayAnImage;
