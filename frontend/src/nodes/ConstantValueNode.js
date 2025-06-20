import React, { useState } from 'react';
import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { useStore } from '../store';

export const ConstantValueNode = ({ id, data }) => {
  const [value, setValue] = useState(data?.value || 'Default Value');
  const { updateNodeField } = useStore.getState();

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateNodeField(id, 'value', newValue);
  };

  const handles = [
    { type: 'source', position: Position.Right, idSuffix: 'value' }
  ];

  return (
    <BaseNode nodeId={id} title="Constant Value" handlesConfig={handles}>
      <label htmlFor={`${id}-value`}>Value:</label>
      <input
        id={`${id}-value`}
        type="text"
        value={value}
        onChange={handleChange}
        className="nodrag"
      />
    </BaseNode>
  );
};