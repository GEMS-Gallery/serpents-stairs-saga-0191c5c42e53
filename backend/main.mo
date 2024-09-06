import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

actor {
  type GameState = {
    players: [var ?Nat];
    currentPlayer: Nat;
    snakesAndLadders: [(Nat, Nat)];
  };

  stable var gameState: GameState = {
    players = [var null, null];
    currentPlayer = 0;
    snakesAndLadders = [
      (16, 6), (47, 26), (49, 11), (56, 53), (62, 19),
      (64, 60), (87, 24), (93, 73), (95, 75), (98, 78),
      (4, 14), (9, 31), (20, 38), (28, 84), (40, 59), (51, 67), (63, 81), (71, 91)
    ];
  };

  public func initGame() : async () {
    gameState := {
      players = [var null, null];
      currentPlayer = 0;
      snakesAndLadders = gameState.snakesAndLadders;
    };
  };

  public func rollDice() : async Nat {
    let seed = await Random.blob();
    let randomNumber = Random.rangeFrom(6, seed);
    randomNumber + 1
  };

  public func movePlayer(playerId: Nat, steps: Nat) : async ?Nat {
    let currentPosition = switch (gameState.players[playerId]) {
      case (?pos) pos;
      case null 0;
    };
    var newPosition = currentPosition + steps;

    if (newPosition > 100) {
      newPosition := 100 - (newPosition - 100);
    };

    for ((start, end) in gameState.snakesAndLadders.vals()) {
      if (newPosition == start) {
        newPosition := end;
      };
    };

    gameState.players[playerId] := ?newPosition;
    gameState := {
      players = gameState.players;
      currentPlayer = if (playerId == 0) 1 else 0;
      snakesAndLadders = gameState.snakesAndLadders;
    };

    ?newPosition
  };

  public query func getGameState() : async {
    players: [?Nat];
    currentPlayer: Nat;
    snakesAndLadders: [(Nat, Nat)];
  } {
    {
      players = Array.freeze(gameState.players);
      currentPlayer = gameState.currentPlayer;
      snakesAndLadders = gameState.snakesAndLadders;
    }
  };

  public func newGame() : async () {
    await initGame();
  };
}