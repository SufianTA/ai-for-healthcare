import { useEffect, useRef, useState } from 'react';

export function useTimer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const start = () => {
    const now = new Date();
    startTimeRef.current = now;
    setElapsed(0);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - now.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    return now;
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRunning(false);
    const end = new Date();
    if (startTimeRef.current) {
      setElapsed(Math.floor((end.getTime() - startTimeRef.current.getTime()) / 1000));
    }
    return end;
  };

  return { running, elapsed, start, stop, reset: () => setElapsed(0), startedAt: startTimeRef.current };
}
