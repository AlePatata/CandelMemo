
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import colors from '../../styles/colors';

const Button = ({
    title,
    onPress = () => {},
    height = 55,
    width = '100%',
    fontsize = 18,
    backgroundColor = colors.yellow,
    disabled = false,
    textColor = colors.white,
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          height: height,
          width: width,
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          borderRadius: 10,
          elevation: 1,
        }}
        disabled={disabled}>
        <Text
          style={{
            color: textColor,
            fontWeight: 'bold',
            fontSize: fontsize,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
};

export default Button;

