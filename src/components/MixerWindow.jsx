import { useState } from 'react';
import mixerIcon from '../assets/windows98-icons/ico/mixer_sound.ico';
import './MixerWindow.css';

const MixerWindow = ({ drumVolume, synthVolume, onDrumVolumeChange, onSynthVolumeChange }) => {
  return (
    <div className="mixer-window-container">
      <h3 className="mixer-window-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
        <img src={mixerIcon} alt="Mixer" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
        Mixer
      </h3>
      <div className="mixer-controls">
        <div className="mixer-channel">
          <div className="mixer-channel-label">Drums</div>
          <div className="mixer-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={drumVolume}
              onChange={(e) => onDrumVolumeChange(parseFloat(e.target.value))}
              className="mixer-slider"
              orient="vertical"
            />
            <div className="mixer-value">{Math.round(drumVolume * 100)}%</div>
          </div>
        </div>
        <div className="mixer-channel">
          <div className="mixer-channel-label">Synth</div>
          <div className="mixer-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={synthVolume}
              onChange={(e) => onSynthVolumeChange(parseFloat(e.target.value))}
              className="mixer-slider"
              orient="vertical"
            />
            <div className="mixer-value">{Math.round(synthVolume * 100)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixerWindow;

