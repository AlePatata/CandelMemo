import React, {useState} from 'react';
import { View, Text, Modal, TouchableOpacity} from 'react-native';
import CustomButton from './buttons/button';
import globalStyles from '../styles/globalStyles';


const MainPage = ({ navigation }) => {
  

  return (
    <View style={globalStyles.whitecontainer}>
      <Text style={globalStyles.title}>¡Bienvenido a MEMO!</Text>
      <Text style={globalStyles.text}> </Text>
      
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