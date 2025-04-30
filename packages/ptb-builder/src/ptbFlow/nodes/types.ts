import { IotaMoveNormalizedModule } from '@iota/iota-sdk/client';
import { Connection, Edge, Node } from '@xyflow/react';

export const NumericTypes = new Set([
  'u8',
  'u16',
  'u32',
  'u64',
  'u128',
  'u256',
]);

export type TYPE_PARAMS =
  | 'address'
  | 'string'
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'bool'
  | 'object';

export type TYPE_ARRAY =
  | 'address[]'
  | 'string[]'
  | 'u8[]'
  | 'u16[]'
  | 'u32[]'
  | 'u64[]'
  | 'u128[]'
  | 'u256[]'
  | 'bool[]'
  | 'object[]';

export type TYPE_VECTOR =
  | 'vector<address>'
  | 'vector<u8>'
  | 'vector<u16>'
  | 'vector<u32>'
  | 'vector<u64>'
  | 'vector<u128>'
  | 'vector<u256>'
  | 'vector<bool>'
  | 'vector<object>'
  | 'vector<string>';

export type TYPE =
  | TYPE_PARAMS
  | TYPE_ARRAY
  | TYPE_VECTOR
  | 'number'
  | 'number[]'
  | 'moveCall'
  | 'command';

export enum PTBNodeType {
  Address = 'IotaAddress',
  AddressArray = 'IotaAddressArray',
  AddressVector = 'IotaAddressVector',
  AddressWallet = 'IotaAddressWallet',

  Bool = 'IotaBool',
  BoolArray = 'IotaBoolArray',
  BoolVector = 'IotaBoolVector',

  Number = 'IotaNumber',
  NumberArray = 'IotaNumberArray',
  NumberVector = 'IotaNumberVector',

  Object = 'IotaObject',
  ObjectArray = 'IotaObjectArray',
  ObjectVector = 'IotaObjectVector',
  ObjectGas = 'IotaObjectGas',
  ObjectClock = 'IotaObjectClock',
  ObjectDenyList = 'IotaObjectDenyList',
  ObjectOption = 'IotaObjectOption',
  ObjectRandom = 'IotaObjectRandom',
  ObjectSystem = 'IotaObjectSystem',
  CoinWithBalance = 'IotaObjectCoinWithBalance',
  String = 'IotaString',
  StringArray = 'IotaStringArray',
  StringVector = 'IotaStringVector',
  String0x2iotaIota = 'IotaString0x2iotaIota',

  MergeCoins = 'MergeCoins',
  SplitCoins = 'SplitCoins',
  TransferObjects = 'TransferObjects',
  MakeMoveVec = 'MakeMoveVec',
  MoveCall = 'MoveCall',
  Publish = 'Publish',
  Upgrade = 'Upgrade',

  Start = 'Start',
  End = 'End',
}

interface IotaMoveNormalizedModuleWithNames extends IotaMoveNormalizedModule {
  _nameFunctions_: string[];
}

export type PTBModuleData = {
  _nameModules_: string[]; // module names
  modules: Record<string, IotaMoveNormalizedModuleWithNames>;
};

export interface PTBMoveCall {
  package?: string;
  module?: string;
  function?: string;
  setTypeArgs?: () => string[];
  getTypeArgs?: () => string[];
}

export interface PTBNodeData {
  [key: string]: unknown;
  label: string;
  value?: string | string[] | number | number[];
  splitInputs?: number;
  makeMoveVector?: { type: TYPE_PARAMS; omit: boolean };
  moveCall?: PTBMoveCall;
}

export interface PTBNodeProp {
  id: string;
  data: PTBNodeData;
}

export interface PTBNode extends Node {
  data: PTBNodeData;
}

export interface PTBEdge extends Edge {
  type: 'Data' | 'Command';
}

export const isValidHandleType = (
  connection: Connection,
  type: TYPE,
  oppositeHandle: 'targetHandle' | 'sourceHandle',
): boolean => {
  if (
    connection &&
    connection[oppositeHandle] &&
    typeof connection[oppositeHandle] === 'string'
  ) {
    const parsed = (connection[oppositeHandle] as string).split(':');
    return !!parsed[1] && parsed[1] === type;
  }
  return false;
};
