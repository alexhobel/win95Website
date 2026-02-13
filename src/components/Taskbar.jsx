import './Taskbar.css';

const Taskbar = ({ windows, onWindowClick }) => {
  const allWindows = windows;

  return (
    <div className="taskbar">
      <button className="start-button">
        <span className="start-icon">start</span>
        <span className="start-text">Start</span>
      </button>
      <div className="taskbar-windows">
        {allWindows.map((window) => (
          <button
            key={window.id}
            className={`taskbar-window-button ${window.minimized ? 'minimized' : 'active'}`}
            onClick={() => onWindowClick(window.id)}
          >
            {window.title}
          </button>
        ))}
      </div>
      <div className="system-tray">
        <div className="system-tray-time">
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
