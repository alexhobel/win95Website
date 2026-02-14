import { useState, useEffect, useRef, useCallback } from 'react';
import mixerIcon from '../assets/windows98-icons/ico/mixer_sound.ico';
import midiIcon from '../assets/windows98-icons/ico/midi_bl.ico';
import './MusicMaker.css';

const MusicMaker = ({ drumVolume: propDrumVolume, synthVolume: propSynthVolume, onOpenMixer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [drumPattern, setDrumPattern] = useState({
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    clap: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  });
  const drumVolume = propDrumVolume ?? 0.7;
  const synthVolume = propSynthVolume ?? 0.7;
  const [synthPattern, setSynthPattern] = useState(Array(16).fill(null));
  const [synthWaveform, setSynthWaveform] = useState('square');
  const [synthOctave, setSynthOctave] = useState(4);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const drumPatternRef = useRef(drumPattern);
  const synthPatternRef = useRef(synthPattern);
  const synthWaveformRef = useRef(synthWaveform);
  const synthOctaveRef = useRef(synthOctave);
  const bpmRef = useRef(bpm);
  const drumVolumeRef = useRef(drumVolume);
  const synthVolumeRef = useRef(synthVolume);

  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Keep refs in sync with state for real-time updates
  useEffect(() => {
    drumPatternRef.current = drumPattern;
  }, [drumPattern]);

  useEffect(() => {
    synthPatternRef.current = synthPattern;
  }, [synthPattern]);

  useEffect(() => {
    synthWaveformRef.current = synthWaveform;
  }, [synthWaveform]);

  useEffect(() => {
    synthOctaveRef.current = synthOctave;
  }, [synthOctave]);

  useEffect(() => {
    drumVolumeRef.current = drumVolume;
  }, [drumVolume]);

  useEffect(() => {
    synthVolumeRef.current = synthVolume;
  }, [synthVolume]);

  const playTone = useCallback((frequency, duration = 0.2, type = 'sine') => {
    if (!audioContextRef.current) return;
    
    const currentVolume = synthVolumeRef.current;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(currentVolume, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  const playDrumSound = useCallback((type) => {
    if (!audioContextRef.current) return;
    
    const currentVolume = drumVolumeRef.current;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    if (type === 'kick') {
      oscillator.frequency.setValueAtTime(60, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, audioContextRef.current.currentTime + 0.1);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(currentVolume, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } else if (type === 'snare') {
      const noise = audioContextRef.current.createBufferSource();
      const buffer = audioContextRef.current.createBuffer(1, audioContextRef.current.sampleRate * 0.2, audioContextRef.current.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;
      noise.connect(gainNode);
      oscillator.frequency.value = 200;
      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.gain.setValueAtTime(currentVolume * 0.5, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      noise.start();
      oscillator.start();
      noise.stop(audioContextRef.current.currentTime + 0.2);
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    } else if (type === 'hihat') {
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(currentVolume * 0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } else if (type === 'clap') {
      // Clap sound - multiple short bursts of noise
      const clapCount = 3;
      for (let i = 0; i < clapCount; i++) {
        setTimeout(() => {
          const noise = audioContextRef.current.createBufferSource();
          const buffer = audioContextRef.current.createBuffer(1, audioContextRef.current.sampleRate * 0.05, audioContextRef.current.sampleRate);
          const data = buffer.getChannelData(0);
          for (let j = 0; j < buffer.length; j++) {
            data[j] = Math.random() * 2 - 1;
          }
          noise.buffer = buffer;
          const clapGain = audioContextRef.current.createGain();
          noise.connect(clapGain);
          clapGain.connect(audioContextRef.current.destination);
          clapGain.gain.setValueAtTime(currentVolume * 0.4, audioContextRef.current.currentTime);
          clapGain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.05);
          noise.start();
          noise.stop(audioContextRef.current.currentTime + 0.05);
        }, i * 10);
      }
    }
  }, []);

  useEffect(() => {
    bpmRef.current = bpm;
    // Update interval if playing
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      const stepDuration = (60 / bpm / 4) * 1000;
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = (prev + 1) % 16;
          
          // Play drums using refs for real-time pattern
          if (drumPatternRef.current.kick[prev]) playDrumSound('kick');
          if (drumPatternRef.current.snare[prev]) playDrumSound('snare');
          if (drumPatternRef.current.hihat[prev]) playDrumSound('hihat');
          if (drumPatternRef.current.clap && drumPatternRef.current.clap[prev]) playDrumSound('clap');
          
          // Play synth notes
          const synthNote = synthPatternRef.current[prev];
          if (synthNote) {
            const frequencies = {
              'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
              'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
              'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
            };
            const baseFreq = frequencies[synthNote] || 440;
            const octave = synthOctaveRef.current;
            const freq = baseFreq * Math.pow(2, octave - 4);
            playTone(freq, 0.2, synthWaveformRef.current);
          }
          
          return nextStep;
        });
      }, stepDuration);
    }
  }, [bpm, isPlaying, playDrumSound, playTone]);

  const toggleDrumStep = (drum, step) => {
    setDrumPattern(prev => ({
      ...prev,
      [drum]: prev[drum].map((val, idx) => idx === step ? (val ? 0 : 1) : val)
    }));
  };

  const playSequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentStep(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setIsPlaying(true);
    const stepDuration = (60 / bpmRef.current / 4) * 1000; // 16th notes
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % 16;
        
        // Play drums using refs for real-time pattern updates
        if (drumPatternRef.current.kick[prev]) playDrumSound('kick');
        if (drumPatternRef.current.snare[prev]) playDrumSound('snare');
        if (drumPatternRef.current.hihat[prev]) playDrumSound('hihat');
        if (drumPatternRef.current.clap && drumPatternRef.current.clap[prev]) playDrumSound('clap');
        
        // Play synth notes
        const synthNote = synthPatternRef.current[prev];
        if (synthNote) {
          const frequencies = {
            'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
            'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
            'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
          };
          const baseFreq = frequencies[synthNote] || 440;
          const octave = synthOctaveRef.current;
          const freq = baseFreq * Math.pow(2, octave - 4);
          playTone(freq, 0.2, synthWaveformRef.current);
        }
        
        return nextStep;
      });
    }, stepDuration);
  };

  const synthNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const toggleSynthStep = (step, note) => {
    setSynthPattern(prev => {
      const newPattern = [...prev];
      if (newPattern[step] === note) {
        newPattern[step] = null; // Clear if same note clicked
      } else {
        newPattern[step] = note; // Set note
      }
      return newPattern;
    });
  };

  return (
    <div className="music-maker-container">
      <div className="music-maker-header">
        <h2 className="music-maker-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <img src={midiIcon} alt="MIDI" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
          Music Maker
          <img src={midiIcon} alt="MIDI" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
        </h2>
        <div className="music-maker-controls">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={playSequence}
          >
            {isPlaying ? '⏸ STOP' : '▶ PLAY'}
          </button>
          <div className="bpm-control">
            <label>BPM:</label>
            <input 
              type="number" 
              value={bpm} 
              onChange={(e) => setBpm(Math.max(60, Math.min(200, parseInt(e.target.value) || 120)))}
              className="bpm-input"
            />
          </div>
          <button 
            className="open-mixer-button"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Mixer button clicked, onOpenMixer:', typeof onOpenMixer);
              if (onOpenMixer && typeof onOpenMixer === 'function') {
                try {
                  onOpenMixer();
                  console.log('onOpenMixer called successfully');
                } catch (error) {
                  console.error('Error calling onOpenMixer:', error);
                }
              } else {
                console.warn('onOpenMixer callback not provided or not a function:', onOpenMixer);
              }
            }}
            title="Open Mixer Window"
            disabled={!onOpenMixer}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img src={mixerIcon} alt="Mixer" style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }} />
            Open Mixer
          </button>
        </div>
      </div>

      <div className="music-maker-content">
        {/* Drum Sequencer Section - Now on top */}
        <div className="drum-section">
          <h3 className="section-title">Drum Sequencer</h3>
          <div className="drum-sequencer">
            <div className="drum-row">
              <div className="drum-label">Kick</div>
              <div className="drum-steps">
                {drumPattern.kick.map((active, step) => (
                  <button
                    key={step}
                    className={`drum-step ${active ? 'active' : ''} ${currentStep === step && isPlaying ? 'current' : ''}`}
                    onClick={() => toggleDrumStep('kick', step)}
                  />
                ))}
              </div>
            </div>
            <div className="drum-row">
              <div className="drum-label">Snare</div>
              <div className="drum-steps">
                {drumPattern.snare.map((active, step) => (
                  <button
                    key={step}
                    className={`drum-step ${active ? 'active' : ''} ${currentStep === step && isPlaying ? 'current' : ''}`}
                    onClick={() => toggleDrumStep('snare', step)}
                  />
                ))}
              </div>
            </div>
            <div className="drum-row">
              <div className="drum-label">Hi-Hat</div>
              <div className="drum-steps">
                {drumPattern.hihat.map((active, step) => (
                  <button
                    key={step}
                    className={`drum-step ${active ? 'active' : ''} ${currentStep === step && isPlaying ? 'current' : ''}`}
                    onClick={() => toggleDrumStep('hihat', step)}
                  />
                ))}
              </div>
            </div>
            <div className="drum-row">
              <div className="drum-label">Clap</div>
              <div className="drum-steps">
                {drumPattern.clap.map((active, step) => (
                  <button
                    key={step}
                    className={`drum-step ${active ? 'active' : ''} ${currentStep === step && isPlaying ? 'current' : ''}`}
                    onClick={() => toggleDrumStep('clap', step)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="drum-buttons">
            <button className="drum-test-button" onClick={() => playDrumSound('kick')}>
              Test Kick
            </button>
            <button className="drum-test-button" onClick={() => playDrumSound('snare')}>
              Test Snare
            </button>
            <button className="drum-test-button" onClick={() => playDrumSound('hihat')}>
              Test Hi-Hat
            </button>
            <button className="drum-test-button" onClick={() => playDrumSound('clap')}>
              Test Clap
            </button>
          </div>
        </div>

        {/* UFO Synthesizer Section */}
        <div className="synth-section">
          <h3 className="section-title">🛸 UFO Synthesizer 🛸</h3>
          <div className="ufo-synth">
            <div className="ufo-top">
              <div className="ufo-dome">
                <div className="ufo-lights">
                  <div className={`ufo-light ${synthWaveform === 'sine' ? 'active' : ''}`}></div>
                  <div className={`ufo-light ${synthWaveform === 'square' ? 'active' : ''}`}></div>
                  <div className={`ufo-light ${synthWaveform === 'sawtooth' ? 'active' : ''}`}></div>
                  <div className={`ufo-light ${synthWaveform === 'triangle' ? 'active' : ''}`}></div>
                </div>
              </div>
            </div>
            <div className="ufo-controls">
              <div className="synth-control-group">
                <label className="synth-label">Waveform:</label>
                <div className="waveform-buttons">
                  <button 
                    className={`waveform-btn ${synthWaveform === 'sine' ? 'active' : ''}`}
                    onClick={() => setSynthWaveform('sine')}
                  >Sine</button>
                  <button 
                    className={`waveform-btn ${synthWaveform === 'square' ? 'active' : ''}`}
                    onClick={() => setSynthWaveform('square')}
                  >Square</button>
                  <button 
                    className={`waveform-btn ${synthWaveform === 'sawtooth' ? 'active' : ''}`}
                    onClick={() => setSynthWaveform('sawtooth')}
                  >Saw</button>
                  <button 
                    className={`waveform-btn ${synthWaveform === 'triangle' ? 'active' : ''}`}
                    onClick={() => setSynthWaveform('triangle')}
                  >Tri</button>
                </div>
              </div>
              <div className="synth-control-group">
                <label className="synth-label">Octave:</label>
                <div className="octave-control">
                  <button 
                    className="octave-btn"
                    onClick={() => setSynthOctave(Math.max(2, synthOctave - 1))}
                  >-</button>
                  <span className="octave-value">{synthOctave}</span>
                  <button 
                    className="octave-btn"
                    onClick={() => setSynthOctave(Math.min(6, synthOctave + 1))}
                  >+</button>
                </div>
              </div>
            </div>
            <div className="synth-sequencer">
              <div className="synth-sequencer-header">
                <div className="synth-note-labels">
                  {synthNotes.map((note, idx) => (
                    <div key={idx} className="synth-note-label">{note}</div>
                  ))}
                </div>
              </div>
              <div className="synth-steps-grid">
                {Array.from({ length: 16 }, (_, step) => (
                  <div key={step} className="synth-step-column">
                    <div className={`step-indicator ${currentStep === step && isPlaying ? 'current' : ''}`}>
                      {step + 1}
                    </div>
                    {synthNotes.map((note, noteIdx) => {
                      const isActive = synthPattern[step] === note;
                      return (
                        <button
                          key={noteIdx}
                          className={`synth-step-btn ${isActive ? 'active' : ''} ${currentStep === step && isPlaying && isActive ? 'playing' : ''}`}
                          onClick={() => toggleSynthStep(step, note)}
                          title={`Step ${step + 1} - ${note}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="music-maker-footer">
        <div className="status-bar">
          <span>{isPlaying ? '▶ Playing...' : '⏸ Stopped'}</span>
          <span>Step: {currentStep + 1}/16</span>
        </div>
      </div>
    </div>
  );
};

export default MusicMaker;

