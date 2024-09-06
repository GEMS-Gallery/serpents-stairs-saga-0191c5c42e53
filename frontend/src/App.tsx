import React, { useState, useEffect } from 'react';
import { Typography, Button, CircularProgress, Box } from '@mui/material';
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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<any>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
    setDiceValue(value);
    await movePlayer(value);
    setLoading(false);
  };

  const movePlayer = async (steps: number) => {
    const currentPlayer = gameState.currentPlayer;
    await backend.movePlayer(currentPlayer, steps);
    await fetchGameState();
  };

  const renderBoard = () => {
    const cells = [];
    for (let i = 100; i > 0; i--) {
      cells.push(
        <Cell key={i}>
          {i}
          {gameState.players.map((pos: number | null, index: number) => 
            pos === i ? <Player key={index} player={index} /> : null
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
        {diceValue && (
          <Typography variant="h6" component="span">
            Dice: {diceValue}
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography>
          Current Player: {gameState.currentPlayer + 1}
        </Typography>
        <Typography>
          Player 1 Position: {gameState.players[0] || 'Start'}
        </Typography>
        <Typography>
          Player 2 Position: {gameState.players[1] || 'Start'}
        </Typography>
      </Box>
    </Box>
  );
};

export default App;