import React from 'react';
import { View, Image } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const DisplayAnImage = ({ source }) => {
  const imageSource = source ? source : require('../../assets/target.png');
  
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.orangecontainer} >
          <Image
            style={[globalStyles.tinyLogo, globalStyles.card]}
            source={imageSource}
            resizeMode="contain"
          />
      </View>
    </View>
  );
};



export default DisplayAnImage;

