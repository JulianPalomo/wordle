import { useEffect, useState } from 'react';
import './styles.css'
import ConfettiExplosion from 'react-confetti-explosion';
import { Line } from './Components/Line';

const WORD_LENGTH = 5;

function App() {
  const [dictionary, setDictionary] = useState([]);
  ///Random word
  const [solution, setSolution] = useState('');
  ///Guesses is the grid
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  ///The current guess
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [shakeIndex, setShakeIndex] = useState(null);

  useEffect(() => {

    const handleTyping = (event) => {

      if (isGameOver) return;

      if (event.key === 'Enter') {

        if (currentGuess.length !== 5) return;

        ///Animation word doesn't exist
        console.log(dictionary);
        if (!dictionary.includes(currentGuess.toUpperCase())) {
          setShakeIndex(null);
          setTimeout(() => {
            setShakeIndex(guesses.findIndex(val => val === null));
          }, 10);
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess.toUpperCase();
        setGuesses(newGuesses);
        setCurrentGuess('');



        const isCorrect = solution === currentGuess.toUpperCase();

        ///Winner found !
        if (isCorrect) {
          setIsGameOver(true);
        }
        return;
      }

      if (currentGuess >= 5) return;

      ///Case user wants to erase a caracter
      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      // Check if the key pressed is a letter
      if (event.key.match(/^[a-zA-Z]$/)) {
        if (currentGuess.length < WORD_LENGTH) {
          setCurrentGuess(oldGuess => oldGuess + event.key);
        }
      }
    };

    window.addEventListener('keydown', handleTyping);

    return () => window.removeEventListener('keydown', handleTyping);

  }, [currentGuess, isGameOver, solution, guesses,shakeIndex])

  ///Fetch random word
  useEffect(() => {

    const fetchWord = async () => {
      const res = await fetch('words.json');
      const words = await res.json();

      setDictionary(words);
      const randomWord = words[Math.floor(Math.random() * words.length)]

      ///Seting the solution
      setSolution(randomWord);
    }

    fetchWord();
  }, []);

  return (
    <>
      <h1>Welcome to Juli's Wordle !</h1>

      <div className='board'>
        {isGameOver && <ConfettiExplosion />}

        {
          guesses.map((guess, i) => {
            const isCurrentGuess = i === guesses.findIndex(val => val == null);
            return (
              <Line
                key={i}
                guess={isCurrentGuess ? currentGuess : guess ?? ''}
                isFinal={!isCurrentGuess && guess != null}
                solution={solution}
                index={i}
                shakeIndex={shakeIndex}
              />);
          })

        }
      </div>
      <div>
        <h4>How to play?</h4>
        <p>
        In <b>Wordle</b>, your goal is to guess the secret word in the fewest number of attempts possible. Start by typing a five-letter word and press Enter. The game will provide clues about the correct word: letters that are correct and in the correct position will be highlighted in green, letters that are correct but in the wrong position will be highlighted in yellow, and incorrect letters will be highlighted in gray. Use these clues to adjust your guesses and solve the word before running out of attempts. Good luck and have fun!
        </p>
      </div>
    </>
  );
};

export default App;