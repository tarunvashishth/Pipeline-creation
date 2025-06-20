import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <PipelineToolbar />
      <div className="main-content-area">
        <PipelineUI />
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;