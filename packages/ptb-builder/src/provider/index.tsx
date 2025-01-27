import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { IotaMoveNormalizedModules } from '@iota/iota-sdk/client';
import { ColorModeClass } from '@xyflow/react';

import { EnqueueToast, setToast } from './toastManager';
import { PTBModuleData } from '../ptbFlow/nodes/types';
import { getPackageData, toPTBModuleData } from '../utilities';
export { EnqueueToast, setToast, enqueueToast } from './toastManager';

export enum NETWORK {
  MainNet = 'mainnet',
  TestNet = 'testnet',
  DevNet = 'devnet',
}

export const NETWORKS: NETWORK[] = [
  NETWORK.DevNet,
  NETWORK.TestNet,
  NETWORK.MainNet,
];

export interface IState {
  colorMode: ColorModeClass;
  hasPath: boolean;
  canEdit: boolean;
  network: NETWORK;
  wallet?: string;
  fetchPackageData?: (packageId: string) => Promise<PTBModuleData | undefined>;
  exportPackageData?: () => Record<string, IotaMoveNormalizedModules>;
  importPackageData?: (data: Record<string, IotaMoveNormalizedModules>) => void;
}

let packageDataCache: Record<string, IotaMoveNormalizedModules> = {};

const StateContext = createContext<IState | undefined>(undefined);
const StateUpdateContext = createContext<
  React.Dispatch<React.SetStateAction<IState>> | undefined
>(undefined);

export const StateProvider = ({
  canEdit,
  network,
  children,
  wallet,
  enqueueToast,
}: {
  canEdit: boolean;
  network: NETWORK;
  wallet?: string;
  enqueueToast?: EnqueueToast;
  children: ReactNode;
}) => {
  const [state, setState] = useState<IState>({
    network,
    colorMode: 'dark',
    hasPath: false,
    canEdit,
    wallet,
  });

  const fetchPackageData = useCallback(
    async (packageId: string): Promise<PTBModuleData | undefined> => {
      try {
        if (!packageId) {
          return undefined;
        }
        if (!packageDataCache) {
          packageDataCache = {};
        }
        if (packageDataCache[packageId]) {
          return toPTBModuleData(packageDataCache[packageId]);
        }
        const data = await getPackageData(network, packageId);
        if (data) {
          packageDataCache[packageId] = data;
        }
        return toPTBModuleData(packageDataCache[packageId]);
      } catch (error) {
        throw error;
      }
    },
    [network],
  );

  const exportPackageData = useCallback((): Record<
    string,
    IotaMoveNormalizedModules
  > => {
    return packageDataCache;
  }, []);

  const importPackageData = useCallback(
    (data: Record<string, IotaMoveNormalizedModules>) => {
      packageDataCache = data;
    },
    [],
  );

  useEffect(() => {
    setState((old) => ({ ...old, canEdit }));
  }, [canEdit]);

  useEffect(() => {
    setState((old) => ({ ...old, wallet }));
  }, [wallet]);

  useEffect(() => {
    setState((old) => ({ ...old, network }));
  }, [network]);

  useEffect(() => {
    setToast((message, options) => {
      enqueueToast && enqueueToast(message, { variant: options.variant });
    });
  }, [enqueueToast]);

  return (
    <StateContext.Provider
      value={{
        ...state,
        fetchPackageData,
        exportPackageData,
        importPackageData,
      }}
    >
      <StateUpdateContext.Provider value={setState}>
        {children}
      </StateUpdateContext.Provider>
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};

export const useStateUpdateContext = () => {
  const context = useContext(StateUpdateContext);
  if (context === undefined) {
    throw new Error(
      'useStateUpdateContext must be used within a StateProvider',
    );
  }
  return context;
};

export const readPackageData = (
  packageId: string,
): PTBModuleData | undefined => {
  if (!packageId || !packageDataCache) {
    return undefined;
  }
  if (packageDataCache[packageId]) {
    return toPTBModuleData(packageDataCache[packageId]);
  }
  return undefined;
};
