import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

// Define una función para generar secuencias basadas en patrones
const generateSequence = (pattern, length) => {
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(pattern[i % pattern.length]); // El módulo asegura que el patrón se repita
  }
  return sequence;
};

function shuffleArray(array) {
  // Función para mezclar un arreglo de manera aleatoria
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function chunkArray(array, chunkSize) {
  // Divide un arreglo en grupos de un tamaño específico
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

function App() {
  const [sequence, setSequence] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    generateNewSequence();
  }, []);

  const generateNewSequence = () => {
    // Define un patrón de secuencia lógico (por ejemplo, 'ab')
    const logicalPattern = 'ab'; // Puedes personalizar esto según tus necesidades
    // Define la longitud de la secuencia
    const sequenceLength = 6; // Puedes personalizar esto también
    
    // Genera la secuencia basada en el patrón lógico
    const newSequence = generateSequence(logicalPattern, sequenceLength);
    
    // Mezcla las letras del patrón de manera aleatoria
    const randomizedSequence = shuffleArray(newSequence);
    
    setSequence(randomizedSequence);
    setUserAnswer('');
    setFeedback('');
    // Establece la respuesta correcta
    setCorrectAnswer(newSequence.join(' '));
  };

  const checkAnswer = (option) => {
    // Verifica si la opción seleccionada coincide con la siguiente figura en la secuencia
    if (option === correctAnswer) {
      // Respuesta correcta
      setScore(score + 1);

      if (sequence.length === 1) {
        // El usuario completó la secuencia
        setFeedback('Correcto');
        // Genera una nueva secuencia después de un breve período de tiempo
        setTimeout(() => {
          generateNewSequence();
        }, 1000);
      } else {
        sequence.shift(); // Elimina la figura actual de la secuencia
      }
    } else {
      // Respuesta incorrecta
      setScore(0);
      setFeedback('Incorrecto');
      // Genera una nueva secuencia después de un breve período de tiempo
      setTimeout(() => {
        generateNewSequence();
      }, 1000);
    }
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => checkAnswer(item)}
    >
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Puntuación: {score}</Text>
      <View style={styles.sequenceContainer}>
        <Text style={styles.sequenceText}>{sequence.join(' ')}</Text>
        <Text style={styles.arrowText}>-></Text>
        <Text style={styles.blankBox}></Text>
      </View>
      {feedback ? (
        <Text style={styles.feedbackText}>{feedback}</Text>
      ) : (
        <View style={styles.optionsContainer}>
          {chunkArray(shuffleArray(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']), 3).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.optionRow}>
              {row.map((item, columnIndex) => (
                <TouchableOpacity
                  key={columnIndex}
                  style={styles.optionButton}
                  onPress={() => checkAnswer(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
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
    justifyContent: 'center',
    paddingTop: '30%',
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
  sequenceText: {
    fontSize: 24,
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
    backgroundColor: 'blue',
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
});

export default App;
