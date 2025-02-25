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

import {
  generateRandomHand,
  classifyHandByCustomLogic,
  getRandomRanks,
  isRedCard,
} from '../utils/cardUtils';
import { fetchRandomWord } from '../utils/api';
import { saveGameToCookie } from '../utils/gameUtils';

export default function GuessTheCards() {
  const [timeLeft, setTimeLeft] = useState<number>(100);
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

  const handleCloseModal = (e: MouseEvent, reason: string) => {
    if (reason && reason === 'backdropClick') return;
    setOpenModal(false);
  };

  const handleTryAgain = () => {
    setCorrectCount(0); // Reset the score
    setTimeLeft(100); // Reset the time
    handleNewHand(); // Start a new game
    setOpenModal(false); // Close the modal
  };

  useEffect(() => {
    if (openModal && timeLeft === 0) {
      saveGameToCookie(correctCount); // Save game data when the game ends
    }
  }, [openModal, timeLeft, correctCount]);

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
