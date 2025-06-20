import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';

export const DisplayDataNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, idSuffix: 'input' }
  ];

  const nodeSpecificStyle = { minHeight: '60px' };

  return (
    <BaseNode nodeId={id} title="Display Data" handlesConfig={handles} style={nodeSpecificStyle}>
      <div style={{ padding: '8px', background: '#f0f0f0', minHeight: '30px', borderRadius: '4px', color: '#555', textAlign: 'center', fontSize: '11px', marginTop: '5px' }}>
        {data?.displayValue || '(Connect input to see data)'}
      </div>
    </BaseNode>
  );
};