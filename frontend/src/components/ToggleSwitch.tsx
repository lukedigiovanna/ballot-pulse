import React from 'react';
import '../styles/ToggleSwitch.css'; // Import your CSS file

interface ToggleSwitchProps {
    isChecked: boolean,
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onToggle }) => (
  <label className="switch">
    <input type="checkbox" checked={isChecked} onChange={onToggle} />
    <span className="slider"></span>
  </label>
);

export { ToggleSwitch };