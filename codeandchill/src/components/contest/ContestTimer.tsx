import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ContestTimerProps {
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed';
}

export const ContestTimer: React.FC<ContestTimerProps> = ({ startTime, endTime, status }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      let targetTime: number;
      let newLabel: string;

      if (status === 'upcoming') {
        targetTime = start;
        newLabel = 'Starts in';
      } else if (status === 'active') {
        targetTime = end;
        newLabel = 'Ends in';
      } else {
        setTimeLeft('Contest Ended');
        setLabel('');
        return;
      }

      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        let timeString = '';
        if (days > 0) {
          timeString = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          timeString = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          timeString = `${minutes}m ${seconds}s`;
        } else {
          timeString = `${seconds}s`;
        }

        setTimeLeft(timeString);
        setLabel(newLabel);
      } else {
        // Time's up, update status instead of refreshing
        if (status === 'upcoming') {
          setTimeLeft('Contest Started');
          setLabel('');
        } else if (status === 'active') {
          setTimeLeft('Contest Ended');
          setLabel('');
        }
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  const getColorClass = () => {
    if (status === 'upcoming') return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (status === 'active') return 'text-green-400 bg-green-500/10 border-green-500/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getColorClass()}`}>
      <Clock size={18} />
      <div className="flex flex-col">
        {label && <span className="text-xs opacity-75">{label}</span>}
        <span className="font-mono font-semibold">{timeLeft}</span>
      </div>
    </div>
  );
};
