export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getGameState' : IDL.Func(
        [],
        [
          IDL.Record({
            'snakesAndLadders' : IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat)),
            'currentPlayer' : IDL.Nat,
            'players' : IDL.Vec(IDL.Opt(IDL.Nat)),
          }),
        ],
        ['query'],
      ),
    'initGame' : IDL.Func([], [], []),
    'movePlayer' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    'newGame' : IDL.Func([], [], []),
    'rollDice' : IDL.Func([], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
