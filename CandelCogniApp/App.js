import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainPage from './components/MainPage';
import Game from './components/Game';
import WithImages from './components/WithImages';

const Stack = createStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="WithImages" component={WithImages} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
