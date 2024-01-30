import { StyleSheet } from "react-native";
import colors from "./colors";

const hexToRGBA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    if (alpha) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

export default TutorialModalStyle = StyleSheet.create({
    container: {
        zIndex: 2,
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right:0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundColor,
    },
    modalContainer: {
        backgroundColor: hexToRGBA(colors.yellow, 0.5),
        maxWidth: "90%",
        minHeight: "50%",
        borderRadius: 20,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    tutorialTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: colors.black,
        margin: 10,
        textAlign: 'center',
    },
    tutorialText: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "600",
        margin: 10,
        textAlign: 'justify',
    },
    sequenceContainer: {
        backgroundColor:colors.backgroundColor, 
        margin: 10,
        transform:[{scale:0.9}], 
        borderRadius: 20,
        flexDirection: "row",
        alignSelf: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sequenceItem: {
        marginHorizontal: 1,
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: colors.yellow,
        padding: 5,
        borderRadius: 5,
        width: 30, // fondo amarillo
        height: 30, // fondo amarillo
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blankBox: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
    }, 
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        margin: 20,
        width: "100%",
    },
    card: {
        backgroundColor: 'white',
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 5,
        borderWidth: 5,
        borderColor: 'orange',
      },
    tinyLogo: {
        width: 90,
        height: 90,
    },

});