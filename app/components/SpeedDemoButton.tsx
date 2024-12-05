import React from 'react';

interface SpeedDemoButtonProps {
  onClick: () => void;
  className?: string;
}

const SpeedDemoButton: React.FC<SpeedDemoButtonProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors ${className || ''}`}
  >
    Start Speed Demo
  </button>
);

export default SpeedDemoButton;