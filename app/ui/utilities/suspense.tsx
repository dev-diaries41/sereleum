import React from 'react';
import LoadingIndicator from '../utilities/circle-loading-indicator';

export default function SuspenseFallback() {
  return (
    <div className="w-full flex absolute inset-0 items-center justify-center text-center py-8 px-4">
      <LoadingIndicator size={40} />
    </div>
  );
}
