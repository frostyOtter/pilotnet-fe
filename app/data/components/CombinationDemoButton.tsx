import React from 'react';

interface CombinationDemoButtonProps {
  onClick: () => void;
  className?: string;
}

const CombinationDemoButton: React.FC<CombinationDemoButtonProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`mt-4 bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors ${className || ''}`}
  >
    Start Combined Demo
  </button>
);

export default CombinationDemoButton;