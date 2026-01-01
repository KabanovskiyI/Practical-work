import { useState, useEffect } from "react";

export function useTimer(startSeconds, onEnd) {
  const [remainingTime, setRemainingTime] = useState(startSeconds);

  useEffect(() => {
    if (remainingTime <= 0) {
      if (onEnd) onEnd();
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onEnd) onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, onEnd]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return { minutes, seconds, remainingTime };
}
