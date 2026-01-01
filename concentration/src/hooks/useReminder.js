import { useEffect, useRef, useState } from "react";

export function useReminder(triggerTime, { showDuration = 30_000 } = {}) {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const triggeredRef = useRef(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (triggerTime <= 0) return;

    const timeout = setTimeout(async () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      try {
        const res = await fetch("http://localhost:3000/");
        const data = await res.json();
        if (data?.warmup) {
          setText(data.warmup);
          setVisible(true);

          hideTimeoutRef.current = setTimeout(() => {
            setVisible(false);
          }, showDuration);
        }
      } catch (e) {
        console.error("Reminder fetch error", e);
      }
    }, triggerTime * 1000);

    return () => {
      clearTimeout(timeout);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [triggerTime, showDuration]);

  return { text, visible };
}

