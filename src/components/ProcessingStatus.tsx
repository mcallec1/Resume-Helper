import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'processing' | 'completed' | 'error';
  message?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, message }) => {
  const statusConfig = {
    processing: {
      icon: <Loader2 className="animate-spin" />,
      text: 'Processing your resume...',
      className: 'text-[#4f46e5]',
    },
    completed: {
      icon: '✓',
      text: 'Resume updated successfully!',
      className: 'text-[#ff2ec7]',
    },
    error: {
      icon: '✕',
      text: message || 'An error occurred',
      className: 'text-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center space-x-2 ${config.className}`}>
      <span className="text-2xl">{config.icon}</span>
      <span className="font-medium">{config.text}</span>
    </div>
  );
}