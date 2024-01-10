import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainPage from './components/MainPage';
import Game from './components/Game';
import WithImages from './components/WithImages';
import Tutorial from './components/Tutorial';
import Temporal from './components/Temporal';

const Stack = createStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="WithImages" component={WithImages} />
        <Stack.Screen name="Tutorial" component={Tutorial} />
        <Stack.Screen name="Temporal" component={Temporal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
