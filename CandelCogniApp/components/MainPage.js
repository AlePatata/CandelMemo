import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from './buttons/button';
import globalStyles from '../styles/globalStyles';



const MainPage = ({ navigation }) => {
  return (
    <View style={globalStyles.whitecontainer}>
      <Text style={globalStyles.title}>¡Bienvenido a MEMO!</Text>
      <Text style={globalStyles.text}> </Text>
      
      <CustomButton
        title="Jugar"
        onPress={() => navigation.navigate('WithImages')}
        
      />
    </View>
  );
};

export default MainPage;