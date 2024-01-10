import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, Animated, Easing} from 'react-native';
import globalStyles from '../styles/globalStyles';


const withoutImage = {id:1,"path":require("./../assets/target.png"), "name":"PNG", "size_w":300, "size_h":300, "level":0};


  
const Temporal = ({navigation}) => {
    const [image, setImage] = useState(withoutImage)
    const rotationValue = useRef(new Animated.Value(0)).current;


    const handleCardClick = () => {
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          // Cambiar la imagen después de la animación
          setImage({
            id: 1,
            path: require('./../assets/Cruz.png'),
            name: 'PNG',
            size_w: 300,
            size_h: 300,
            level: 0,
          });
    
          // Reiniciar el valor de la animación para futuros clics
          rotationValue.setValue(0);
        });
    };
    const rotateCard = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      });

    return (
        <View style={globalStyles.whitecontainer}>
            <TouchableOpacity
            style={globalStyles.card}
            onPress={handleCardClick}>
            <Animated.Image
                style={[
                globalStyles.tinyLogo,
                globalStyles.card,
                { transform: [{ rotateY: rotateCard }] },
                ]}
                source={image.path}
                resizeMode="contain"
            />
            </TouchableOpacity>
        </View>
    );
};
export default Temporal;