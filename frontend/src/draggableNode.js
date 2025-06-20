export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const nodeStyle = {
      cursor: 'grab',
      padding: '10px',
      minWidth: '90px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      backgroundColor: '#495057',
      color: '#f8f9fa',
      textAlign: 'center',
      fontSize: '12px',
      border: '1px solid #343a40',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'background-color 0.15s ease-in-out, transform 0.15s ease-in-out',
    };

    const onMouseEnter = (event) => {
        event.target.style.backgroundColor = '#5a6268';
        event.target.style.transform = 'translateY(-1px)';
    };
    const onMouseLeave = (event) => {
        event.target.style.backgroundColor = '#495057';
        event.target.style.transform = 'translateY(0px)';
    };

    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={nodeStyle}
        draggable
      >
          <span>{label}</span>
      </div>
    );
  };