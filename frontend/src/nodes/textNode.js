// frontend/src/nodes/TextNode.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { Position, Handle, useUpdateNodeInternals } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { useStore } from '../store';

const textareaBaseStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxSizing: 'border-box',
  minHeight: '60px',
  resize: 'vertical',
  overflowY: 'hidden',
  fontSize: '12px',
  lineHeight: '1.4',
  marginTop: '4px',
};

const errorStyle = {
  color: 'red',
  fontSize: '11px',
  marginTop: '5px',
};

const handleLabelStyle = {
  position: 'absolute',
  right: '15px', 
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '10px',
  color: '#333',
  background: 'rgba(240, 240, 240, 0.85)',
  padding: '1px 4px',
  borderRadius: '3px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 5,
};


export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const [dynamicInputHandles, setDynamicInputHandles] = useState([]);
  const textareaRef = useRef(null);
  const { updateNodeField } = useStore.getState();
  const [isTextEmpty, setIsTextEmpty] = useState(currText.trim() === '');

  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(60, textareaRef.current.scrollHeight)}px`;
    }
  }, [currText]);

  const calculateNewHandles = useCallback((text) => {
    const variableRegex = /{{\s*([a-zA-Z_][a-zA-Z0-9_.]*?)\s*}}/g;
    let match;
    const newHandlesData = [];
    const uniqueVariables = new Set();

    while ((match = variableRegex.exec(text)) !== null) {
      uniqueVariables.add(match[1]);
    }

    const totalHandles = uniqueVariables.size;
    let i = 0;
    uniqueVariables.forEach(varName => {
      const topOffset = 35; 
      const availableHeight = 70; 
      const positionStep = totalHandles > 0 ? availableHeight / totalHandles : availableHeight;
      let topPercentage = topOffset + (positionStep * i) + (positionStep / 2) - 15;
      topPercentage = Math.max(15, Math.min(85, topPercentage));

      newHandlesData.push({
        idSuffix: `var-${varName.replace(/\./g, '_')}`,
        name: varName,
        style: { top: `${topPercentage}%` }
      });
      i++;
    });
    return newHandlesData;
  }, []);

  useEffect(() => {
    const newHandles = calculateNewHandles(currText);
    if (JSON.stringify(dynamicInputHandles) !== JSON.stringify(newHandles)) {
      setDynamicInputHandles(newHandles);
    }
  }, [currText, calculateNewHandles, dynamicInputHandles]);

  useEffect(() => {
    if (id) { 
      updateNodeInternals(id);
    }
  }, [id, dynamicInputHandles, updateNodeInternals]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    updateNodeField(id, 'text', newText);
    setIsTextEmpty(newText.trim() === '');
  };

  const staticHandlesConfig = [
    { type: 'source', position: Position.Right, idSuffix: 'output', style: { right: '-5px' } }
  ];

  const nodeStyle = {
     minWidth: '250px',
     border: isTextEmpty && data.showError ? '1px solid red' : (selected ? '1px solid #007bff' : '1px solid #ccc'),
  };

  const shouldShowError = isTextEmpty && (data.showError || selected);

  return (
    <BaseNode
        nodeId={id}
        title="Text"
        handlesConfig={staticHandlesConfig}
        style={nodeStyle}
    >
      <div>
        <textarea
          id={`text-area-${id}`}
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          placeholder="Type `{{variable_name}}` to utilize variables"
          style={textareaBaseStyle}
          className="nodrag"
          rows={3}
        />
        {shouldShowError && (
            <div style={errorStyle}>
                 Text field is required
            </div>
        )}
      </div>
      {dynamicInputHandles.map((handleInfo) => (
        <Handle
          key={handleInfo.idSuffix}
          type="target"
          position={Position.Left} // Handle dot is on the left
          id={`${id}-${handleInfo.idSuffix}`}
          style={{
            ...handleInfo.style,
            background: '#555',
            width: '10px', height: '10px',
            left: '-5px' 
          }}
        >
          {/* Label for the handle */}
          <span style={handleLabelStyle}>
            {handleInfo.name}
          </span>
        </Handle>
      ))}
    </BaseNode>
  );
}