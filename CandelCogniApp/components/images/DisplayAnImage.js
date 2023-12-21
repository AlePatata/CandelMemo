import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ImageSize from 'react-native-image-size';

const DisplayAnImage = ({ source }) => {
  // Establecer una imagen predeterminada si no se proporciona una fuente
  const imageSource = source ? source : require('../../assets/logo_peq.png');
  //const Size = ImageSize.getSize(source)

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
    width: 100,
    height: 100,
  },
  logo: {
    width: 100,
    height: 150,
  },
});

export default DisplayAnImage;
