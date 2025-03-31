import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import FixedSpaceScene from './components/FixedSpaceScene';
import { PlanetData, OrbitSpeedMode, ViewPerspective } from './types/types';
import PlanetInfo from './components/PlanetInfo';
import ControlPanel from './components/ControlPanel';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [settings, setSettings] = useState({
    orbitSpeed: 'normal' as OrbitSpeedMode,
    viewPerspective: 'isometric' as ViewPerspective,
    showOrbits: true,
    showLabels: true
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Track cursor position and check if hovering over a planet
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handlePlanetHover = (e: MutationRecord[]) => {
      for (const mutation of e) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const canvas = mutation.target as HTMLElement;
          setShowCustomCursor(canvas.classList.contains('planet-hover'));
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    const canvas = document.querySelector('canvas');
    if (canvas) {
      const observer = new MutationObserver(handlePlanetHover);
      observer.observe(canvas, { attributes: true });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        observer.disconnect();
      };
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle orbit control settings change
  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
  };
  
  // Handle planet selection with transition effect
  const handlePlanetSelect = (planet: PlanetData | null) => {
    setSelectedPlanet(planet);
    
    // Trigger transition animation
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500); // Match the animation duration in FixedSpaceScene
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div className="loading-text">Preparing Universe</div>
      </div>
    );
  }

  return (
    <div className="App" ref={canvasRef}>
      <Canvas
        style={{ width: '100vw', height: '100vh', background: '#000' }}
        camera={{ position: [0, 0, 50], fov: 60 }}
      >
        <FixedSpaceScene 
          onPlanetSelect={handlePlanetSelect} 
          orbitControlsSettings={settings}
        />
      </Canvas>
      
      {/* Planet information */}
      {selectedPlanet && (
        <PlanetInfo
          planet={selectedPlanet}
          onClose={() => handlePlanetSelect(null)}
          textureUrl={selectedPlanet.textureUrl}
        />
      )}
      
      {/* Control panel */}
      <ControlPanel 
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      
      <div className="app-title">Planetarium</div>
      
      <div className="controls-info">
        <p>Mouse: Navigate | Click: Select Planet</p>
        <p>Scroll: Zoom In/Out</p>
      </div>
      
      <div className="help-button" onClick={() => setShowHelp(!showHelp)}>
        ?
      </div>
      
      {/* Camera transition effects */}
      <div className={`camera-transition-overlay ${isTransitioning ? 'active' : ''}`}></div>
      <div className={`motion-blur ${isTransitioning ? 'active' : ''}`}></div>
      <div className={`zoom-lines ${isTransitioning ? 'active' : ''}`}></div>
      
      {/* Custom cursor for planet hover */}
      {showCustomCursor && (
        <div 
          className="custom-cursor" 
          style={{ 
            left: `${cursorPosition.x}px`, 
            top: `${cursorPosition.y}px` 
          }}
        ></div>
      )}
      
      {showHelp && (
        <div className="planet-info-container" onClick={() => setShowHelp(false)}>
          <div className="planet-info visible">
            <div className="hologram-lines"></div>
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
            
            <div className="sw-header">
              <div className="sw-title">NAVIGATION SYSTEMS</div>
              <div className="sw-subtitle">USER MANUAL</div>
            </div>
            
            <button className="close-button" onClick={() => setShowHelp(false)}>×</button>
            
            <div className="sw-section">
              <div className="sw-section-header">MISSION BRIEFING</div>
              <p className="description">
                Welcome to the Galactic Navigation System. Your mission is to explore the
                star system and gather intelligence on each planetary body. Use the controls
                outlined below to navigate through space.
              </p>
            </div>
            
            <div className="sw-section">
              <div className="sw-section-header">CONTROL SYSTEMS</div>
              <ul className="facts-list">
                <li><span className="sw-fact-number">[1]</span> Click and drag to rotate your view of the system</li>
                <li><span className="sw-fact-number">[2]</span> Use scroll wheel to adjust viewing distance</li>
                <li><span className="sw-fact-number">[3]</span> Click on any planet to access planetary database</li>
                <li><span className="sw-fact-number">[4]</span> Use "Return to Navigation" to exit planet view</li>
                <li><span className="sw-fact-number">[5]</span> Use the Control Panel to adjust orbit speed and view perspective</li>
              </ul>
            </div>
            
            <button className="explore-button" onClick={() => setShowHelp(false)}>
              Begin Exploration
            </button>
            
            <div className="sw-footer">
              <div className="sw-footer-text">NAVIGATION PROTOCOL • REF-7842</div>
              <div className="sw-footer-date">CLEARANCE LEVEL: EXPLORER</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
