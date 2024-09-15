import React from 'react';
import '../styles/ToggleSwitch.css'; // Import your CSS file

interface ToggleSwitchProps {
    isChecked: boolean,
    onToggle: () => void;
    disabled: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onToggle, disabled }) => (
  <label className="switch">
    <input type="checkbox" checked={isChecked} onChange={onToggle} disabled={disabled} />
    <span className="slider"></span>
  </label>
);

export { ToggleSwitch };