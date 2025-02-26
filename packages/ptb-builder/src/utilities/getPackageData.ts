import {
  getFullnodeUrl,
  IotaClient,
  IotaMoveNormalizedFunction,
  IotaMoveNormalizedModule,
  IotaMoveNormalizedModules,
  IotaMoveNormalizedType,
} from '@iota/iota-sdk/client';

import { enqueueToast, NETWORK } from '../provider';
import { PTBModuleData } from '../ptbFlow/nodes/types';

const deleteTxContext = (
  types: IotaMoveNormalizedType[],
): IotaMoveNormalizedType[] => {
  return types.filter((type) => {
    if (typeof type === 'object') {
      const struct =
        (type as any).MutableReference?.Struct ||
        (type as any).Reference?.Struct ||
        (type as any).Struct;
      return !(
        struct &&
        struct.address === '0x2' &&
        struct.module === 'tx_context' &&
        struct.name === 'TxContext'
      );
    }
    return true;
  });
};

export const toPTBModuleData = (
  data: IotaMoveNormalizedModules,
): PTBModuleData => {
  const processedModules: PTBModuleData = Object.entries(data).reduce(
    (acc, [moduleName, moduleData]: [string, IotaMoveNormalizedModule]) => {
      const functionNames = Object.keys(moduleData.exposedFunctions);
      const functions = functionNames.reduce<
        Record<string, IotaMoveNormalizedFunction>
      >((funcAcc, name) => {
        funcAcc[name] = {
          ...moduleData.exposedFunctions[name],
          parameters: deleteTxContext(
            moduleData.exposedFunctions[name].parameters,
          ),
        };
        return funcAcc;
      }, {});
      moduleData.exposedFunctions = functions;
      acc._nameModules_.push(moduleName);
      acc.modules[moduleName] = {
        ...moduleData,
        _nameFunctions_: functionNames,
      };
      return acc;
    },
    {
      _nameModules_: [],
      modules: {},
    } as PTBModuleData,
  );
  return processedModules;
};

export const getPackageData = async (
  network: NETWORK,
  packageId: string,
): Promise<IotaMoveNormalizedModules | undefined> => {
  try {
    const client = new IotaClient({
      url: getFullnodeUrl(network),
    });
    const modules: IotaMoveNormalizedModules =
      await client.getNormalizedMoveModulesByPackage({
        package: packageId,
      });
    return modules;
  } catch (error) {
    enqueueToast(`${error}`, {
      variant: 'error',
    });
    return undefined;
  }
};
