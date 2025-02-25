import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Hand } from 'pokersolver';
import Cookies from 'js-cookie';

const fetchRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
      headers: { 'X-Api-Key': 'dtF3yrt680hNHbcr3kxSYg==sk2qOIbhbImCvA1k' },
    });
    const data: { word: string } = await response.json();
    return data.word;
  } catch (error) {
    console.error('Error fetching word:', error);
    return 'Oops! No word today.';
  }
};

const generateRandomHand = (): string[] => {
  const suits = ['♥', '♦', '♣', '♠'];
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  const generatedHand: string[] = [];
  const usedCards: Set<string> = new Set();

  while (generatedHand.length < 5) {
    const value = values[Math.floor(Math.random() * 13)];
    const suit = suits[Math.floor(Math.random() * 4)];
    const card = `${value}${suit}`;

    if (!usedCards.has(card)) {
      generatedHand.push(card);
      usedCards.add(card);
    }
  }

  return generatedHand;
};

const getRandomRanks = (correctRank: string): string[] => {
  const allRanks = [
    'Straight Flush',
    'Four of a Kind',
    'Full House',
    'Flush',
    'Straight',
    'Three of a Kind',
    'Two Pair',
    'One Pair',
    'High Card',
  ];
  const incorrectRanks = allRanks.filter((rank) => rank !== correctRank);
  return [
    correctRank,
    ...incorrectRanks.sort(() => 0.5 - Math.random()).slice(0, 2),
  ].sort(() => 0.5 - Math.random());
};

const classifyHandByCustomLogic = (hand: string[]): string => {
  const values = hand.map((card) => card.slice(0, -1)); // Get the values of the cards
  const uniqueValues = [...new Set(values)];

  if (uniqueValues.length === 2) {
    const counts = values.reduce(
      (acc: { [key: string]: number }, val: string) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {}
    );
    const countValues = Object.values(counts);

    if (countValues.includes(4)) {
      return 'Four of a Kind';
    } else if (countValues.includes(3) && countValues.includes(2)) {
      return 'Full House';
    }
  }

  if (uniqueValues.length === 3) {
    const counts = values.reduce(
      (acc: { [key: string]: number }, val: string) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {}
    );
    const countValues = Object.values(counts);

    if (countValues.includes(3)) {
      return 'Three of a Kind';
    } else if (countValues.includes(2)) {
      return 'Two Pair';
    }
  }

  if (uniqueValues.length === 4) {
    return 'One Pair';
  }

  return 'High Card';
};

export default function GuessTheCards() {
  const [timeLeft, setTimeLeft] = useState<number>(3);
  const [hand, setHand] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [randomWord, setRandomWord] = useState<string>('');
  const [rankOptions, setRankOptions] = useState<string[]>([]);
  const [correctRank, setCorrectRank] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setOpenModal(true); // Open modal when the game is over
    }
  }, [timeLeft]);

  useEffect(() => {
    handleNewHand();
  }, []);

  const checkAnswer = (rank: string) => {
    const isCorrect = rank === correctRank;
    if (isCorrect) {
      setTimeLeft((prev) => prev + 5);
      setCorrectCount((prev) => prev + 1);
    }

    handleNewHand();
  };

  const handleNewHand = () => {
    const newHand = generateRandomHand();
    const solvedHand = Hand.solve(newHand);

    let detectedRank = '';
    if (solvedHand.name) {
      detectedRank = solvedHand.name === 'Pair' ? 'One Pair' : solvedHand.name;
    }

    if (!detectedRank) {
      detectedRank = classifyHandByCustomLogic(newHand);
    }

    setCorrectRank(detectedRank);
    setRankOptions(getRandomRanks(detectedRank));
    setHand(newHand);
    setRandomWord('Loading...');
    fetchRandomWord().then(setRandomWord);
  };

  const isRedCard = (card: string): boolean => {
    return card.includes('♦') || card.includes('♥');
  };

  const handleCloseModal = (e: MouseEvent, reason: string) => {
    if (reason && reason === 'backdropClick') return;
    setOpenModal(false);
  };

  const handleTryAgain = () => {
    setCorrectCount(0); // Reset the score
    setTimeLeft(3); // Reset the time
    handleNewHand(); // Start a new game
    setOpenModal(false); // Close the modal
  };

  const saveGameToCookie = () => {
    const gameData = {
      score: correctCount,
      date: new Date().toLocaleString(), // Format date
    };

    const existingGames = Cookies.get('games')
      ? JSON.parse(Cookies.get('games') || '[]')
      : [];

    existingGames.push(gameData);
    Cookies.set('games', JSON.stringify(existingGames), { expires: 365 });
  };

  useEffect(() => {
    if (openModal && timeLeft === 0) {
      saveGameToCookie(); // Save game data when the game ends
    }
  }, [openModal]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4">Guess the Cards</Typography>
      <Typography variant="h6">Time Left: {timeLeft}s</Typography>
      {hand.length > 0 && (
        <Card style={{ padding: '10px', margin: '10px', fontSize: '24px' }}>
          <Typography variant="h5">
            {hand.map((card, index) => (
              <span
                key={index}
                style={{
                  color: isRedCard(card) ? 'red' : 'black',
                  marginRight: '5px',
                }}
              >
                {card}
              </span>
            ))}
          </Typography>
        </Card>
      )}
      <div style={{ margin: '10px 0' }}>
        {rankOptions.map((rank, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => checkAnswer(rank)}
            style={{ margin: '5px' }}
          >
            {rank}
          </Button>
        ))}
      </div>
      <Typography variant="subtitle1">
        Bonus Word: {randomWord || <CircularProgress size={15} />}
      </Typography>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Game Over!</DialogTitle>
        <DialogContent>
          <div>
            <Typography variant="body1">Score: {correctCount}</Typography>
            <Typography variant="body1">Previous Games:</Typography>
            {Cookies.get('games') &&
              JSON.parse(Cookies.get('games') || '').map(
                (game: { score: number; date: string }, index: number) => (
                  <div key={index}>
                    <Typography variant="body2">
                      Score: {game.score} - Date: {game.date}
                    </Typography>
                  </div>
                )
              )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTryAgain} color="primary">
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
