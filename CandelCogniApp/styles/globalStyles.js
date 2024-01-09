import {StyleSheet, Animated} from 'react-native';
import colors from './colors';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whitecontainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orangecontainer:{
    backgroundColor: colors.yellow,
    justifyContent: 'center', 
    alignItems: 'center',
    maxHeight:'80%',
    maxWidth:'90%',
    borderRadius: 10,
    padding: 10,
  },
  insiderText:{
    fontSize: 24,
    fontWeight: 'bold',
    fontWeight: '900',
    textAlign: 'center',
    color: colors.white
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  tinyLogo: {
    width: 90,
    height: 90,
  },
  container: {
    paddingTop: 0,
    paddingHorizontal: 40,
  },
  cardWrapper: {
    width: 100,
    height: 100,
    perspective: 1000, // Establece la perspectiva para crear un efecto 3D
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden', // Oculta la cara posterior durante la animación
  },
  cardFront: {
    // Estilos adicionales para la cara frontal de la carta
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }], // Gira la cara posterior para que inicialmente esté oculta
  },
  card: {
    backgroundColor: 'white',
    height: 110,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'orange',
  },
  text: {
    textAlign: 'center',
    color: '#696969',
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});
