import React, { useState } from 'react';
import { ControlPanelProps, OrbitSpeedMode, ViewPerspective } from '../types/types';
import '../styles/ControlPanel.css';

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleSpeedChange = (mode: OrbitSpeedMode) => {
    onSettingsChange({
      ...settings,
      speedMode: mode
    });
  };

  const handleViewChange = (view: ViewPerspective) => {
    onSettingsChange({
      ...settings,
      viewPerspective: view
    });
  };

  return (
    <div className={`control-panel ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="control-panel-header" onClick={() => setExpanded(!expanded)}>
        <h3>CONTROL PANEL</h3>
        <div className="toggle-icon">
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </div>
      </div>
      
      {expanded && (
        <div className="control-panel-content">
          <div className="control-section">
            <h4>View Perspective</h4>
            <div className="button-group">
              <button 
                className={settings.viewPerspective === ViewPerspective.FREE ? 'active' : ''}
                onClick={() => handleViewChange(ViewPerspective.FREE)}
              >
                Free View
              </button>
              <button 
                className={settings.viewPerspective === ViewPerspective.TOP_DOWN ? 'active' : ''}
                onClick={() => handleViewChange(ViewPerspective.TOP_DOWN)}
              >
                Top-Down
              </button>
              <button 
                className={settings.viewPerspective === ViewPerspective.SIDE_VIEW ? 'active' : ''}
                onClick={() => handleViewChange(ViewPerspective.SIDE_VIEW)}
              >
                Side View
              </button>
            </div>
          </div>
          
          <div className="control-section">
            <h4>Orbit Speed</h4>
            <div className="button-group">
              <button 
                className={settings.speedMode === OrbitSpeedMode.PAUSED ? 'active' : ''}
                onClick={() => handleSpeedChange(OrbitSpeedMode.PAUSED)}
              >
                Paused
              </button>
              <button 
                className={settings.speedMode === OrbitSpeedMode.REALTIME ? 'active' : ''}
                onClick={() => handleSpeedChange(OrbitSpeedMode.REALTIME)}
              >
                Real-time
              </button>
              <button 
                className={settings.speedMode === OrbitSpeedMode.FAST ? 'active' : ''}
                onClick={() => handleSpeedChange(OrbitSpeedMode.FAST)}
              >
                Fast
              </button>
              <button 
                className={settings.speedMode === OrbitSpeedMode.VERY_FAST ? 'active' : ''}
                onClick={() => handleSpeedChange(OrbitSpeedMode.VERY_FAST)}
              >
                Very Fast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 