import React from 'react';

interface SpeedDemoButtonProps {
    onClick: () => void;
  }

const SpeedDemoButton: React.FC<SpeedDemoButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mt-4 ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
  >
    Predict Vehicle Speed
  </button>
);

export default SpeedDemoButton;