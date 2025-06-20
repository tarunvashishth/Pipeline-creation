import { useState } from 'react';
import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const { updateNodeField } = useStore.getState();

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setCurrName(newName);
    updateNodeField(id, 'inputName', newName);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setInputType(newType);
    updateNodeField(id, 'inputType', newType);
  };

  const handles = [
    { type: 'source', position: Position.Right, idSuffix: 'value' }
  ];

  return (
    <BaseNode nodeId={id} title="Input" handlesConfig={handles}>
      <div>
        <label htmlFor={`${id}-name`}>Name:</label>
        <input
          id={`${id}-name`}
          type="text"
          value={currName}
          onChange={handleNameChange}
          className="nodrag" // Keep nodrag for UI interactions
        />
        <label htmlFor={`${id}-type`} style={{ marginTop: '8px' }}>Type:</label>
        <select 
          id={`${id}-type`}
          value={inputType} 
          onChange={handleTypeChange} 
          className="nodrag"
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
}