import React, { useEffect, useState } from "react";
import { PlanetInfoProps } from "../types/types";
import "../styles/PlanetInfo.css";

const PlanetInfo: React.FC<PlanetInfoProps> = ({ planet, onClose }) => {
  const {
    id,
    name,
    description,
    facts,
    distanceFromSun,
    temperature,
    moons,
    rings,
    textureUrl,
  } = planet;

  const [showContent, setShowContent] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  // Add animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for description
  useEffect(() => {
    if (!showContent) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= description.length) {
        setTypewriterText(description.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTypewriterComplete(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [description, showContent]);

  // Get orbit period in Earth years (simplified calculation)
  const getOrbitPeriod = () => {
    if (!distanceFromSun) return "Unknown";

    // Convert string distance to number if needed
    const distance =
      typeof distanceFromSun === "string"
        ? parseFloat(distanceFromSun.replace(/[^0-9.]/g, ""))
        : distanceFromSun;

    // Using Kepler's third law approximation
    return Math.sqrt(Math.pow(distance / 150, 3)).toFixed(2) + " Earth years";
  };

  return (
    <div className="planet-info-container">
      <div className={`planet-info ${showContent ? "visible" : ""}`}>
        <div className="sw-header">
          <div className="sw-title">GALACTIC DATABASE</div>
          <div className="sw-subtitle">PLANETARY PROFILE</div>
        </div>

        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="planet-header">
          <div className="planet-image-container">
            <img
              src={textureUrl || `/textures/2k_${id}.jpg`}
              alt={name}
              className="planet-image"
            />
            {rings && id === "saturn" && <div className="saturn-rings"></div>}
          </div>
          <div className="planet-title">
            <h2>{name}</h2>
            <div className="planet-designation">
              Planet ID: {id.toUpperCase()}-
              {Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>
        </div>

        <div className="sw-section">
          <div className="sw-section-header">DESCRIPTION</div>
          <p className="description">
            {typewriterText}
            {!typewriterComplete && <span className="cursor">|</span>}
          </p>
        </div>

        <div className="sw-section">
          <div className="sw-section-header">PLANETARY STATISTICS</div>
          <div className="info-grid">
            {distanceFromSun && (
              <div className="info-item">
                <strong>Distance from Sun</strong>
                <span>{distanceFromSun} million km</span>
              </div>
            )}

            {temperature && (
              <div className="info-item">
                <strong>Temperature</strong>
                <span>{temperature}</span>
              </div>
            )}

            <div className="info-item">
              <strong>Moons</strong>
              <span>{moons}</span>
            </div>

            <div className="info-item">
              <strong>Rings</strong>
              <span>{rings ? "Present" : "None"}</span>
            </div>

            <div className="info-item">
              <strong>Orbit Period</strong>
              <span>{getOrbitPeriod()}</span>
            </div>
          </div>
        </div>

        <div className="sw-section">
          <div className="sw-section-header">INTELLIGENCE REPORT</div>
          <ul className="facts-list">
            {facts.map((fact, index) => (
              <li key={index}>
                <span className="sw-fact-number">[{index + 1}]</span> {fact}
              </li>
            ))}
          </ul>
        </div>

        <button className="explore-button" onClick={onClose}>
          Return to Navigation
        </button>

        <div className="sw-footer">
          <div className="sw-footer-text">
            IMPERIAL ARCHIVES • SECTOR {Math.floor(Math.random() * 8) + 1}
          </div>
          <div className="sw-footer-date">
            STARDATE {new Date().getFullYear() + 300}.
            {Math.floor(Math.random() * 9999)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;
