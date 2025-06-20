import { Handle } from 'reactflow';

const BaseNode = ({ nodeId, title, handlesConfig = [], children, style, className }) => {
  const defaultNodeStyle = {
    border: '1px solid #ccc',
    padding: '10px 15px',
    borderRadius: '8px',
    background: '#fff',
    width: '200px',
    fontSize: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  };

  const mergedStyle = { ...defaultNodeStyle, ...style };

  return (
    <div style={mergedStyle} className={`vs-node ${className || ''}`}>
      {title && (
        <div
          className="vs-node-title"
          style={{
            fontWeight: 'bold',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid #eee',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          {title}
        </div>
      )}
      <div className="vs-node-content">
        {children}
      </div>
      {handlesConfig.map((handleConf) => (
        <Handle
          key={handleConf.idSuffix}
          type={handleConf.type}
          position={handleConf.position}
          id={`${nodeId}-${handleConf.idSuffix}`}
          style={{ ...handleConf.style }}
        />
      ))}
    </div>
  );
};

export default BaseNode;