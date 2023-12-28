import {StyleSheet} from 'react-native';
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
    color: '#696969',
    fontSize: 20,
  }
});
