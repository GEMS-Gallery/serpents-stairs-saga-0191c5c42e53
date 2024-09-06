import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getGameState' : ActorMethod<
    [],
    {
      'snakesAndLadders' : Array<[bigint, bigint]>,
      'currentPlayer' : bigint,
      'players' : Array<[] | [bigint]>,
    }
  >,
  'initGame' : ActorMethod<[], undefined>,
  'movePlayer' : ActorMethod<[bigint, bigint], [] | [bigint]>,
  'newGame' : ActorMethod<[], undefined>,
  'rollDice' : ActorMethod<[], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
