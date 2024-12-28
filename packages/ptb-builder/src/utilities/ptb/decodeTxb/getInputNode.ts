import { SuiCallArg } from '@mysten/sui/client';

import { PTB } from '../../../components';
import { PTBNode } from '../../../ptbFlow/nodes';

export const getInputNode = (
  id: string,
  input: SuiCallArg,
): PTBNode | undefined => {
  if (input.type === 'pure') {
    switch (input.valueType) {
      case 'address':
        return {
          id,
          position: { x: 0, y: 0 },
          type: PTB.Address.Type,
          deletable: false,
          data: {
            label: PTB.Address.Name,
            value: input.value as string,
          },
        };
      case 'bool':
        return {
          id,
          position: { x: 0, y: 0 },
          type: PTB.Bool.Type,
          deletable: false,
          data: {
            label: PTB.Bool.Name,
            value: `${input.value}`,
          },
        };
      case 'u8':
      case 'u16':
      case 'u32':
      case 'u64':
      case 'u128':
      case 'u256':
        return {
          id,
          position: { x: 0, y: 0 },
          type: PTB.Number.Type,
          deletable: false,
          data: {
            label: PTB.Number.Name,
            value: input.value as string,
          },
        };
      case 'string':
        return {
          id,
          position: { x: 0, y: 0 },
          type: PTB.String.Type,
          deletable: false,
          data: {
            label: PTB.String.Name,
            value: input.value as string,
          },
        };
      default:
        // TODO: support array
        if (Array.isArray(input.value)) {
          if (typeof input.value[0] === 'number') {
            return {
              id,
              position: { x: 0, y: 0 },
              type: PTB.Number.Type,
              deletable: false,
              data: {
                label: PTB.Number.Name,
                value: `${input.value[0]}`,
              },
            };
          }
        }
        return undefined;
    }
  } else {
    return {
      id,
      position: { x: 0, y: 0 },
      type: PTB.Object.Type,
      deletable: false,
      data: {
        label: PTB.Object.Name,
        value: input.objectId,
      },
    };
  }
};
