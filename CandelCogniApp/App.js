import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faCircle, 
  faSquare, 
  faStar,
  faHeart,   
  faPlay,   
  faDiamond 
} from '@fortawesome/free-solid-svg-icons';
import colors from './styles/colors';

const patterns = [
  '11111111',   // Nivel 1
  '01010101010', // Nivel 2
  '110110110',   // Nivel 3
  '01210121012', // Nivel 4
];

const customIcons = [
    {
      idx: 0,
      iconName: 'faCircle',
      icon: faCircle,
      size: 32,
      color: 'red',
    },
    {
      idx: 1,
      iconName: 'faSquare',
      icon: faSquare,
      size: 32,
      color: 'green',
    },
    {
      idx: 2,
      iconName: 'faPlay',
      icon: faStar,
      size: 32,
      color: 'yellow',
    },
    {
        idx: 3,
        iconName: 'faPlay',
        icon: faPlay,
        size: 32,
        color: 'purple',
    },
    {
        idx: 4,
        iconName: 'faPlayChikito',
        icon: faPlay,
        size: 20,
        color: 'purple',
    },
    {
        idx: 5,
        iconName: 'faHeart',
        icon: faHeart,
        size: 32,
        color: 'brown',
    },
    {
        idx: 6,
        iconName: 'faHeart',
        icon: faDiamond,
        size: 32,
        color: 'gray',
    },
    {
        idx: 7,
        iconName: 'faSquareChikito',
        icon: faSquare,
        size: 20,
        color: 'green',
      },
      {
        idx: 8,
        iconName: 'faCircleChikito',
        icon: faCircle,
        size: 20,
        color: 'blue',
      },
  ];


const iconOptions = [
  "faCircle", 
  "faSquare", 
  "faPlay",
  "faPlayChikito",   
  "faHeart",   
  "faDiamond",
  "faSquareChikito",
  "faCircleChikito"
]; // Representa íconos disponibles

const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const generarPatron = (level) => {
    if (level <= patterns.length) {
      const patron = patterns[level - 1];
      const totalElements = rows * columns; // Calcula el número total de elementos en la cuadrícula
      const iconIndexes = Array.from({ length: customIcons.length }, (_, i) => i.toString()); // Convertir a cadenas
      const allOptions = [...patron, ...iconIndexes];
      const uniqueOptions = Array.from(new Set(allOptions));
      
      if (uniqueOptions.length < totalElements) {
        // Si no hay suficientes opciones únicas, agrega íconos adicionales
        const remainingOptions = totalElements - uniqueOptions.length;
        const extraOptions = shuffleArray(iconIndexes).slice(0, remainingOptions);
        uniqueOptions.push(...extraOptions);
      }
      
      const alternativas = shuffleArray(uniqueOptions).slice(0, totalElements);
      console.log(alternativas)
      return [patron, alternativas];
    }
    return ['', []];
  };

const rows = 3; // Número de filas
const columns = 3; // Número de columnas

function App() {
  const [sequence, setSequence] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    generateNewSequence();
  }, []);

  const generateNewSequence = (new_level=null) => {
    const currentLevel = new_level !== null ? new_level : level;
    console.log(currentLevel);
    const [logicalPattern, alternativas] = generarPatron(currentLevel);
    const sequenceLength = 6;
    const newSequence = generateSequence(logicalPattern, sequenceLength);
    
    setSequence(newSequence);
    setUserAnswer('');
    setFeedback('');
    setCorrectAnswer(alternativas);
  };

  const generateSequence = (pattern, length) => {
    const sequence = [];
    const customIconsShuffled = shuffleArray(customIcons);
    for (let i = 0; i < length; i++) {
      const iconChar = pattern[i % pattern.length];
      const iconIndex = parseInt(iconChar);
      const icon = customIconsShuffled[iconIndex];
      sequence.push(icon);
    }
    return sequence;
  };

  const checkAnswer = (option) => {
    const correctIcon = correctAnswer[0]; // Obtiene el ícono correcto

    if (option.iconName === correctIcon.iconName) { // Compara los nombres de los íconos
      setScore(score + 1);
      setFeedback('Correcto');
      setLevel(Math.min(level + 1,4));
    } else {
      setScore(Math.max(1, score - 1));
      setFeedback('Incorrecto');
    }

    // Genera una nueva secuencia después de verificar la respuesta
    setTimeout(() => {
      generateNewSequence(Math.min(level + 1,4));
    }, 1500);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Razonamiento lógico</Text>
      <Text style={styles.score}>Nivel: {level}</Text>
      <View style={styles.sequenceContainer}>
        {sequence.map((item, index) => (
          <View key={index} style={styles.sequenceItem}>
            {/* Muestra el ícono correspondiente */}
            <FontAwesomeIcon icon={item.icon} color={item.color} size={item.size} />
          </View>
        ))}
        <Text style={styles.arrowText}>-{'>'}</Text>
        <Text style={styles.blankBox}></Text>
      </View>
      {feedback ? (
        <Text style={styles.feedbackText}>{feedback}</Text>
      ) : (
        <View style={styles.optionsContainer}>
          {chunkArray(correctAnswer, columns).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.optionRow}>
              {row.map((item, columnIndex) => (
                <TouchableOpacity
                  key={columnIndex}
                  style={styles.optionButton}
                  onPress={() => checkAnswer(item)}
                >
                  {/* Muestra el ícono correspondiente */}
                  <FontAwesomeIcon icon={customIcons[item].icon} color={customIcons[item].color} size={customIcons[item].size} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '45%',
    backgroundColor: colors.backgroundColor,
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
  },
  sequenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sequenceItem: {
    marginHorizontal: 5,
    backgroundColor: colors.yellow,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 35,
    alignItems: 'center',
    
  },
  arrowText: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  blankBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: colors.yellow,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
  feedbackText: {
    fontSize: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
},
});

export default App;
