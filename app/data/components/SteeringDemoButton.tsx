import React from 'react';

interface SteeringDemoButtonProps {
  onClick: () => void;
}

const SteeringDemoButton: React.FC<SteeringDemoButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
  >
    Start Steering Demo
  </button>
);

export default SteeringDemoButton;