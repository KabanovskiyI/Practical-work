import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/Home.module.css";

export default function MainPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(["00", "00"]); // [мин, сек]
  const [activeBlock, setActiveBlock] = useState(0); // 0 - лево, 1 - право
  const [blink, setBlink] = useState(true);
  const [task, setTask] = useState("");

  const inputRef = useRef(null);

  // Мигание подчеркивания
  useEffect(() => {
    const interval = setInterval(() => setBlink((p) => !p), 500);
    return () => clearInterval(interval);
  }, []);

  // Функция для активации ввода в конкретный блок
  const focusOnBlock = (index) => {
    setActiveBlock(index);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, 2); // Сразу выделяем текст для перезаписи
      }
    }, 0);
  };

  // Авто-фокус при загрузке
  useEffect(() => {
    focusOnBlock(0);
  }, []);

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 2) val = val.slice(-2); // Ограничение 2 цифры

    const newTime = [...time];
    newTime[activeBlock] = val;
    setTime(newTime);

    // Автопереход на секунды, если ввели 2 цифры в минуты
    if (activeBlock === 0 && val.length === 2) {
      focusOnBlock(1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusOnBlock(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusOnBlock(0);
    }
    if (e.key === "Backspace" && time[activeBlock] === "" && activeBlock === 1) {
      focusOnBlock(0);
    }
    if (e.key === "Enter") {
      inputRef.current.blur();
    }
  };

  const handleBlur = () => {
    // Дополняем нулями при потере фокуса
    const newTime = time.map((t) => (t === "" ? "00" : t.padStart(2, "0")));
    setTime(newTime);
  };

  const handleStart = async () => {
    const mins = parseInt(time[0], 10) || 0;
    const secs = parseInt(time[1], 10) || 0;
    let totalSeconds = mins * 60 + secs;

    if (totalSeconds === 0 && !task.trim()) return;

    let finalTime = [...time];

    // Если 00:00, но есть задача — идем на сервер
    if (totalSeconds === 0 && task.trim()) {
      try {
        const params = new URLSearchParams({ task: task.trim() });
        const res = await fetch(`http://localhost:3000/?${params.toString()}`);
        const data = await res.json();
        const minsFromServer = parseInt(data.time, 10);
        if (minsFromServer > 0) {
          finalTime = [String(minsFromServer).padStart(2, "0"), "00"];
          setTime(finalTime);
        }
      } catch (err) {
        console.error("Server error:", err);
        return;
      }
    }

    navigate("/fire", { state: { time: finalTime } });
  };

  return (
    <div className={styles["home-page"]}>
      <div className={styles.hero__container}>
        
        {/* ВИЗУАЛЬНЫЙ ТАЙМЕР */}
        <div className={styles.hero__timer}>
          <span
            className={styles.timer__segment}
            onClick={() => focusOnBlock(0)}
            style={{
              borderBottom: activeBlock === 0 && blink ? "3px solid #ff8a2a" : "3px solid transparent"
            }}
          >
            {time[0].padStart(2, "0")}
          </span>

          <span style={{ margin: "0 10px" }}>:</span>

          <span
            className={styles.timer__segment}
            onClick={() => focusOnBlock(1)}
            style={{
              borderBottom: activeBlock === 1 && blink ? "3px solid #ff8a2a" : "3px solid transparent"
            }}
          >
            {time[1].padStart(2, "0")}
          </span>
        </div>

        {/* СКРЫТЫЙ ИНПУТ ДЛЯ ЛОГИКИ */}
        <input
          ref={inputRef}
          type="tel"
          className={styles.hidden_input}
          value={time[activeBlock]}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoComplete="off"
        />

        {/* ПОЛЕ ЗАДАЧИ */}
        <input
          type="text"
          placeholder="Введіть задачу..."
          className={styles.hero__input}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          autoComplete="off"
        />

        {/* КНОПКА СТАРТА */}
        <button className={styles.start__button} onClick={handleStart}>
          start
        </button>
      </div>
    </div>
  );
}