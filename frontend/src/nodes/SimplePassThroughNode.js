import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';

export const SimplePassThroughNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, idSuffix: 'in' },
    { type: 'source', position: Position.Right, idSuffix: 'out' }
  ];
  const nodeSpecificStyle = { minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };


  return (
    <BaseNode nodeId={id} title="Pass-Through" handlesConfig={handles} style={nodeSpecificStyle}>
      <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '11px', color: '#777', fontStyle: 'italic' }}>
        <span>Input → Output</span>
      </div>
    </BaseNode>
  );
};