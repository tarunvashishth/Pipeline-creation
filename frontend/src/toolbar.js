import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="pipeline-toolbar-container">
            <h3>Available Nodes</h3>
            <div className="toolbar-nodes-grid">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='concatenateText' label='Concatenate' />
                <DraggableNode type='constantValue' label='Constant' />
                <DraggableNode type='displayData' label='Display' />
                <DraggableNode type='simplePassThrough' label='PassThru' />
                <DraggableNode type='upperCaseText' label='Uppercase' />
            </div>
        </div>
    );
};