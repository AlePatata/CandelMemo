/**
 * Planitlla por JZ
 */
import React, {useEffect, useState} from 'react';
import { View, LogBox, Text, SafeAreaView, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import styles from './styles/globalStyles';
import Button from './components/botones/button';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

function App() {
    const [count, setCount] = useState(0); //estados
    
    useEffect(() => { //permite ejecutar logica cuando cambian variables
      setTimeout(() => {
        console.log("Hola despues de 5 segundos!");
      }, 5000);

      }, []); //Se ejecuta solo una vez

    
    /**
     * Función para obtener la variable de AsyncStorage, ejemplo.
     * @param {string} name - Nombre de la varibale a recuperar
     */
    const getVariable = async (name) => {
        try {
        const variable = await AsyncStorage.getItem(name);
        console.log('variable: ',name,' recuperada ', variable);

        } catch (error) {
        console.log('Error al obtener la variable:', error.message);
        }
    };

      
    const handlePress = () => {
        console.log('presionado');
        setCount(count+1);
        setTimeout(() => {
            getVariable('test');
        }, 500);        
    }
    


    // Lo siguiente se muestra en pantalla
    return (
    <SafeAreaView style={styles.container}>

        <StatusBar barStyle={'dark-content'}/>
       
            <View style={{paddingTop: 10, alignItems: 'center', marginBottom: 10}}>
                <Image
                style={styles.tinyLogo}
                source={require('./assets/Logo_Peq.png')}/>
            </View>

            
            <View style={{ alignItems: 'center', paddingHorizontal: 20}}>
                <Text style={styles.title}>Holis, acá hay un ejemplo de contador {count}</Text>
            </View>


            <View style={{ width: '80%'}}>
                <View style={{ margin: 5}}>
                    <Button title={"Click aqui"} onPress={handlePress}/>
                </View>
                <View style={{ margin: 5}}>
                    <Button title={"Click aqui"} onPress={handlePress}/>
                </View>
                <View style={{ margin: 5}}>
                    <Button title={"Click aqui"} onPress={handlePress}/>
                </View>
            </View>
            

    </SafeAreaView>);
}


export default App;
