import React, { useState } from 'react';
import { ControlPanelProps, OrbitSpeedMode, ViewPerspective } from '../types/types';
import '../styles/ControlPanel.css';

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleSpeedChange = (mode: OrbitSpeedMode) => {
    onSettingsChange({
      ...settings,
      orbitSpeed: mode
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
                className={settings.viewPerspective === 'isometric' ? 'active' : ''}
                onClick={() => handleViewChange('isometric')}
              >
                Free View
              </button>
              <button 
                className={settings.viewPerspective === 'top' ? 'active' : ''}
                onClick={() => handleViewChange('top')}
              >
                Top-Down
              </button>
              <button 
                className={settings.viewPerspective === 'side' ? 'active' : ''}
                onClick={() => handleViewChange('side')}
              >
                Side View
              </button>
            </div>
          </div>
          
          <div className="control-section">
            <h4>Orbit Speed</h4>
            <div className="button-group">
              <button 
                className={settings.orbitSpeed === 'slow' ? 'active' : ''}
                onClick={() => handleSpeedChange('slow')}
              >
                Slow
              </button>
              <button 
                className={settings.orbitSpeed === 'normal' ? 'active' : ''}
                onClick={() => handleSpeedChange('normal')}
              >
                Normal
              </button>
              <button 
                className={settings.orbitSpeed === 'fast' ? 'active' : ''}
                onClick={() => handleSpeedChange('fast')}
              >
                Fast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 