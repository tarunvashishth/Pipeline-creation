import React, { useState } from 'react';
import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  const { updateNodeField } = useStore.getState();

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setCurrName(newName);
    updateNodeField(id, 'outputName', newName);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setOutputType(newType);
    updateNodeField(id, 'outputType', newType);
  };

  const handles = [
    { type: 'target', position: Position.Left, idSuffix: 'value' }
  ];

  return (
    <BaseNode nodeId={id} title="Output" handlesConfig={handles}>
      <div>
        <label htmlFor={`${id}-name`}>Name:</label>
        <input
          id={`${id}-name`}
          type="text"
          value={currName}
          onChange={handleNameChange}
          className="nodrag"
        />
        <label htmlFor={`${id}-type`} style={{ marginTop: '8px' }}>Type:</label>
        <select
          id={`${id}-type`}
          value={outputType}
          onChange={handleTypeChange}
          className="nodrag"
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
}