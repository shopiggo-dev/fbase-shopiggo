// src/components/shopiggo/CountdownTimer.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  expiryTimestamp: string;
}

const calculateTimeLeft = (expiry: string) => {
  const difference = +new Date(expiry) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft as { days: number; hours: number; minutes: number; seconds: number };
};

export function CountdownTimer({ expiryTimestamp }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setTimeLeft(calculateTimeLeft(expiryTimestamp));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiryTimestamp));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTimestamp]);

  if (!isClient) {
    // Render nothing on the server to avoid hydration mismatch
    return null;
  }
  
  const timerComponents = [];

  if (timeLeft.days > 0) {
    timerComponents.push(<span key="days">{timeLeft.days}d</span>);
  }
  if (timeLeft.hours > 0 || timeLeft.days > 0) {
    timerComponents.push(<span key="hours">{timeLeft.hours}h</span>);
  }
  timerComponents.push(<span key="minutes">{timeLeft.minutes}m</span>);
  timerComponents.push(<span key="seconds">{timeLeft.seconds}s</span>);

  const hasTimeLeft = timeLeft.days || timeLeft.hours || timeLeft.minutes || timeLeft.seconds;

  return (
    <div className="flex items-center gap-2 text-sm text-destructive font-medium">
      {hasTimeLeft ? (
        <>
          <Timer className="w-4 h-4" />
          <div className="flex items-center gap-1.5">
            {timerComponents.map((component, index) => (
              <React.Fragment key={index}>
                {component}
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <span>Deal has ended!</span>
      )}
    </div>
  );
}
