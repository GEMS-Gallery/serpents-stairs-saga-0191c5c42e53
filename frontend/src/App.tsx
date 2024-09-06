import React, { useState, useEffect } from 'react';
import { Typography, Button, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';

const GameBoard = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gap: '2px',
  width: '100%',
  maxWidth: '600px',
  aspectRatio: '1',
  background: 'linear-gradient(135deg, #e6f2ff 0%, #f0e6ff 100%)',
  padding: '10px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const Cell = styled(Box)(({ theme }) => ({
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '12px',
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  position: 'relative',
}));

const Player = styled(Box)<{ player: number }>(({ theme, player }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  position: 'absolute',
  transition: 'all 0.5s ease',
  backgroundColor: player === 0 ? '#48bb78' : '#4299e1',
}));

const fromBigInt = (value: bigint): number => Number(value);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<any>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    const state = await backend.getGameState();
    setGameState(state);
  };

  const rollDice = async () => {
    setLoading(true);
    const value = await backend.rollDice();
    setDiceValue(fromBigInt(value));
    await movePlayer(fromBigInt(value));
    setLoading(false);
  };

  const movePlayer = async (steps: number) => {
    const currentPlayer = fromBigInt(gameState.currentPlayer);
    await backend.movePlayer(BigInt(currentPlayer), BigInt(steps));
    await fetchGameState();
  };

  const newGame = async () => {
    setLoading(true);
    await backend.newGame();
    await fetchGameState();
    setDiceValue(null);
    setLoading(false);
  };

  const renderBoard = () => {
    const cells = [];
    for (let i = 100; i > 0; i--) {
      cells.push(
        <Cell key={i}>
          {i}
          {gameState.players.map((pos: bigint | null, index: number) => 
            pos !== null && fromBigInt(pos) === i ? <Player key={index} player={index} /> : null
          )}
        </Cell>
      );
    }
    return cells;
  };

  if (!gameState) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Enhanced Snakes and Ladders
      </Typography>
      <GameBoard>{renderBoard()}</GameBoard>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={rollDice}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Roll Dice'}
        </Button>
        <Button
          variant="outlined"
          onClick={newGame}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          New Game
        </Button>
        <Button
          variant="outlined"
          onClick={() => setRulesOpen(true)}
          sx={{ mr: 2 }}
        >
          Rules
        </Button>
        {diceValue && (
          <Typography variant="h6" component="span">
            Dice: {diceValue}
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography>
          Current Player: {fromBigInt(gameState.currentPlayer) + 1}
        </Typography>
        <Typography>
          Player 1 Position: {gameState.players[0] ? fromBigInt(gameState.players[0]) : 'Start'}
        </Typography>
        <Typography>
          Player 2 Position: {gameState.players[1] ? fromBigInt(gameState.players[1]) : 'Start'}
        </Typography>
      </Box>
      <Dialog open={rulesOpen} onClose={() => setRulesOpen(false)}>
        <DialogTitle>Snakes and Ladders Rules</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            1. Players take turns rolling a die and moving their token the number of spaces shown on the die.
          </Typography>
          <Typography paragraph>
            2. If a player lands on the bottom of a ladder, they climb up to the top of the ladder.
          </Typography>
          <Typography paragraph>
            3. If a player lands on the head of a snake, they slide down to the tail of the snake.
          </Typography>
          <Typography paragraph>
            4. The first player to reach or exceed the last square (100) wins the game.
          </Typography>
          <Typography paragraph>
            5. If a player rolls a number that would put them beyond the last square, they move backwards for the remaining number of spaces.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRulesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;