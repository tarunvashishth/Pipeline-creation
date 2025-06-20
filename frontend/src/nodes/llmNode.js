import { Position } from 'reactflow';
import BaseNode from '../components/BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, idSuffix: 'system', style: { top: '35%' } },
    { type: 'target', position: Position.Left, idSuffix: 'prompt', style: { top: '65%' } },
    { type: 'source', position: Position.Right, idSuffix: 'response' }
  ];

  const llmNodeSpecificStyle = { minHeight: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };

  return (
    <BaseNode nodeId={id} title="LLM" handlesConfig={handles} style={llmNodeSpecificStyle}>
      <div style={{ textAlign: 'center', color: '#555', fontSize: '11px', paddingTop: '5px' }}>
        <span>This is an LLM.</span>
      </div>
    </BaseNode>
  );
}