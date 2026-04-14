import { useState } from 'react';
import { Checkbox } from 'react95';
import './ReverbPlugin.css';

const ReverbPlugin = ({ enabled, onEnabledChange, roomSize, onRoomSizeChange, damping, onDampingChange, wetLevel, onWetLevelChange, dryLevel, onDryLevelChange }) => {
  // Generate particle positions once on mount
  const [particlePositions] = useState(() => {
    const positions = [];
    for (let i = 0; i < 20; i++) {
      positions.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2
      });
    }
    return positions;
  });

  return (
    <div className="reverb-plugin">
      <div className="reverb-plugin-header">
        <div className="reverb-plugin-title">
          <span className="reverb-icon">🌌</span>
          <span className="reverb-title-text">SPACE REVERB</span>
          <span className="reverb-version">v2.0</span>
        </div>
        <Checkbox
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          label=""
        />
      </div>
      
      <div className="reverb-plugin-body">
        <div className="reverb-visualizer">
          <div className="reverb-space-grid"></div>
          <div className="reverb-particles">
            {particlePositions.map((pos, i) => (
              <div key={i} className={`reverb-particle ${enabled ? 'active' : ''}`} style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${pos.delay}s`
              }}></div>
            ))}
          </div>
        </div>
        
        <div className="reverb-controls">
          <div className="reverb-control-group">
            <label className="reverb-control-label">
              <span className="reverb-label-text">ROOM SIZE</span>
              <span className="reverb-label-value">{Math.round(roomSize * 100)}%</span>
            </label>
            <div className="reverb-slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={roomSize}
                onChange={(e) => onRoomSizeChange(parseFloat(e.target.value))}
                className="reverb-slider"
                disabled={!enabled}
              />
              <div className="reverb-slider-track">
                <div 
                  className="reverb-slider-fill" 
                  style={{ width: `${roomSize * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="reverb-control-group">
            <label className="reverb-control-label">
              <span className="reverb-label-text">DAMPING</span>
              <span className="reverb-label-value">{Math.round(damping * 100)}%</span>
            </label>
            <div className="reverb-slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={damping}
                onChange={(e) => onDampingChange(parseFloat(e.target.value))}
                className="reverb-slider"
                disabled={!enabled}
              />
              <div className="reverb-slider-track">
                <div 
                  className="reverb-slider-fill" 
                  style={{ width: `${damping * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="reverb-control-group">
            <label className="reverb-control-label">
              <span className="reverb-label-text">WET LEVEL</span>
              <span className="reverb-label-value">{Math.round(wetLevel * 100)}%</span>
            </label>
            <div className="reverb-slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={wetLevel}
                onChange={(e) => onWetLevelChange(parseFloat(e.target.value))}
                className="reverb-slider"
                disabled={!enabled}
              />
              <div className="reverb-slider-track">
                <div 
                  className="reverb-slider-fill" 
                  style={{ width: `${wetLevel * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="reverb-control-group">
            <label className="reverb-control-label">
              <span className="reverb-label-text">DRY LEVEL</span>
              <span className="reverb-label-value">{Math.round(dryLevel * 100)}%</span>
            </label>
            <div className="reverb-slider-container">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={dryLevel}
                onChange={(e) => onDryLevelChange(parseFloat(e.target.value))}
                className="reverb-slider"
                disabled={!enabled}
              />
              <div className="reverb-slider-track">
                <div 
                  className="reverb-slider-fill" 
                  style={{ width: `${dryLevel * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="reverb-plugin-footer">
        <div className="reverb-status">
          <span className={`reverb-status-indicator ${enabled ? 'active' : ''}`}></span>
          <span className="reverb-status-text">{enabled ? 'ACTIVE' : 'BYPASS'}</span>
        </div>
      </div>
    </div>
  );
};

export default ReverbPlugin;

