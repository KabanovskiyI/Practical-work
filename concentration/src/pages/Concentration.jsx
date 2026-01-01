import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../assets/FirePage.module.css";
import logsImg from "../assets/logs.png";
import { useFire } from "../hooks/useFire";
import { useTimer } from "../hooks/useTimer";
import { useReminder } from "../hooks/useReminder";

export default function FireScene() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const timerRef = useRef(null);
  const [timerEnded, setTimerEnded] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const time = state?.time ?? ["20", "00"];
  const totalSeconds = parseInt(time[0], 10) * 60 + parseInt(time[1], 10);

  useFire(canvasRef, overlayRef, totalSeconds);
  const { minutes, seconds } = useTimer(totalSeconds, () => {
    setTimerEnded(true);
  });

  const MIN_THRESHOLD = 30;
  let triggerInSeconds = 0;
  if (totalSeconds / 2 >= MIN_THRESHOLD) {
    triggerInSeconds = totalSeconds / 2;
  }

  const { text, visible } = useReminder(triggerInSeconds, {
    showDuration: 30_000
  });

  return (
    <div className={styles["fire-page"]}>
      <div className={styles.scene}>
        <div className={styles.sceneBg} />
        <div className={styles.sceneDark} />
        <div className={styles.sceneOverlay} ref={overlayRef} />
        <div className={styles.timer}>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>

        {/* Напоминалка */}
        {text && (
          <div
            className={`${styles.reminder} ${
              visible ? styles.reminderVisible : ""
            }`}
          >
            {text}
          </div>
        )}

        {/* Сообщение о конце таймера */}
        {timerEnded && (
          <div className={styles.endMessageContainer}>
            <div className={`${styles.reminder} ${styles.reminderVisible}`}>
              <p>Час вийшов!</p>
              <button
                className={styles.start__button}
                onClick={() => navigate("/")}
              >
                До головної
              </button>
            </div>
          </div>
        )}

        <img src={logsImg} className={styles.logs} alt="logs" />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
}
