import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';

export const ConcatenateTextNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, idSuffix: 'text1', style: { top: '35%' } },
    { type: 'target', position: Position.Left, idSuffix: 'text2', style: { top: '65%' } },
    { type: 'source', position: Position.Right, idSuffix: 'result' }
  ];

  const nodeSpecificStyle = { minHeight: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };

  return (
    <BaseNode nodeId={id} title="Concatenate Text" handlesConfig={handles} style={nodeSpecificStyle}>
      <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '11px', color: '#555' }}>
        <span>Input A + Input B</span>
      </div>
    </BaseNode>
  );
};