import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-lg font-bold">Initializing GeM-Verify Engine...</h2>
      <p className="text-xs text-slate-400 mt-1">
        Connecting to DigiLocker, GSTN & Central Debarment Registries
      </p>
    </div>
  );
};
