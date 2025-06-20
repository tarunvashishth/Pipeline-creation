import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ConcatenateTextNode } from './nodes/ConcatenateTextNode';
import { ConstantValueNode } from './nodes/ConstantValueNode';
import { DisplayDataNode } from './nodes/DisplayDataNode';
import { SimplePassThroughNode } from './nodes/SimplePassThroughNode';
import { UpperCaseTextNode } from './nodes/UpperCaseTextNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  concatenateText: ConcatenateTextNode,
  constantValue: ConstantValueNode,
  displayData: DisplayDataNode,
  simplePassThrough: SimplePassThroughNode,
  upperCaseText: UpperCaseTextNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let initialData = { id: nodeID, nodeType: `${type}` };
      if (type === 'text') {
        initialData.text = ''; // Default TextNode text
        initialData.showError = false; // For error display
      } else if (type === 'customInput') {
        initialData.inputName = nodeID.replace('customInput-', 'input_');
        initialData.inputType = 'Text';
      } else if (type === 'customOutput') {
        initialData.outputName = nodeID.replace('customOutput-', 'output_');
        initialData.outputType = 'Text';
      } else if (type === 'constantValue') {
        initialData.value = 'Default Value';
      }
      return initialData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();

          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;

            if (typeof type === 'undefined' || !type || !nodeTypes[type]) {
              console.warn("Dropped unknown node type:", type);
              return;
            }

            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };

            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} className="reactflow-wrapper-div">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                fitView
            >
                <Background color="#ccc" gap={gridSize} variant="dots" />
                <Controls />
                <MiniMap nodeStrokeColor={(n) => {
                    if (n.selected) return '#007bff';
                    switch (n.type) {
                        case 'customInput': return '#17a2b8';
                        case 'customOutput': return '#fd7e14';
                        case 'llm': return '#6f42c1';
                        default: return '#6c757d';
                    }
                  }}
                  nodeColor={(n) => {
                    switch (n.type) {
                        case 'customInput': return '#cce5ff';
                        case 'customOutput': return '#ffe8cc';
                        case 'llm': return '#e0d7f0';
                        default: return '#f8f9fa';
                    }
                  }}
                  nodeBorderRadius={2}
                />
            </ReactFlow>
        </div>
    )
}