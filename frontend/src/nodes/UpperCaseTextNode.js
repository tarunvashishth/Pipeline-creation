import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';

export const UpperCaseTextNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, idSuffix: 'input_text' },
    { type: 'source', position: Position.Right, idSuffix: 'output_text' }
  ];
  const nodeSpecificStyle = { minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };

  return (
    <BaseNode nodeId={id} title="To Uppercase" handlesConfig={handles} style={nodeSpecificStyle}>
      <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '11px', color: '#555' }}>
        <span>text → TEXT</span>
      </div>
    </BaseNode>
  );
};