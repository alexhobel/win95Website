import ReverbPlugin from './ReverbPlugin';
import { ScrollView } from 'react95';
import './ReverbWindow.css';

const ReverbWindow = ({
  enabled = false,
  onEnabledChange,
  roomSize = 0.5,
  onRoomSizeChange,
  damping = 0.5,
  onDampingChange,
  wetLevel = 0.3,
  onWetLevelChange,
  dryLevel = 0.7,
  onDryLevelChange,
}) => {
  return (
    <div className="reverb-window-container">
      <div className="reverb-window-content">
        <ScrollView style={{ width: '100%', flex: 1, minHeight: 0 }}>
          <ReverbPlugin
            enabled={enabled}
            onEnabledChange={onEnabledChange}
            roomSize={roomSize}
            onRoomSizeChange={onRoomSizeChange}
            damping={damping}
            onDampingChange={onDampingChange}
            wetLevel={wetLevel}
            onWetLevelChange={onWetLevelChange}
            dryLevel={dryLevel}
            onDryLevelChange={onDryLevelChange}
          />
        </ScrollView>
      </div>
    </div>
  );
};

export default ReverbWindow;

