import React, { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import { PTBNodeProp } from '..';
import { PtbHandle } from '../handles';
import { FormStyle, LabelStyle, NodeStyles } from '../styles';
import { updateNodeData } from './updateNodeData';
import { IconIota } from '../../../icons';

export const IotaString0x2iotaIota = ({ id, data }: PTBNodeProp) => {
  const { setNodes } = useReactFlow();

  useEffect(() => {
    setNodes((nds) =>
      updateNodeData({
        nodes: nds,
        nodeId: id,
        updater: (data) => ({ ...data, value: '0x2::iota::Iota' }),
      }),
    );
  }, [id, setNodes]);

  return (
    <div className={NodeStyles.string}>
      <div className={FormStyle}>
      </div>
      <PtbHandle typeHandle="source" typeParams="string" name="inputs" />
    </div>
  );
};
