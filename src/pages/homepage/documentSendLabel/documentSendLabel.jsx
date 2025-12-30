import React from 'react';

const AttachItem = ({ icon: Icon, label, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center group outline-none"
    >
      <div
        className={`
          relative w-[52px] h-[52px] rounded-full 
          flex items-center justify-center 
          transition-all duration-300 ease-out
          ${color} 
          /* Hover & Active Effects */
          hover:scale-105 active:scale-90 active:brightness-90
          /* Modern Shadow */
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        `}
      >
        {/* Inner Light Ring (makes it look 3D/Glassy) */}
        <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
        
        {/* Icon with subtle drop shadow */}
        <Icon 
          size={22} 
          strokeWidth={2.2} 
          className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-110" 
        />
      </div>

      <span className="mt-2 text-[12px] font-medium text-gray-500 transition-colors group-hover:text-gray-800">
        {label}
      </span>
    </button>
  );
};

export default AttachItem;