import { useEffect, useRef } from "react";
import { Particle } from "../utils/Particle";
import { getCurrentStage, updateMouseVector } from "../utils/fireHelpers";

export function useFire(canvasRef, overlayRef, totalTime = 20 * 60) {
  const startTimeRef = useRef(Date.now());
  const keysPressedRef = useRef(false);
  const stopRef = useRef(false);
  const isActiveRef = useRef(true);
  const lastReturnTimeRef = useRef(0);
  // Используем Ref для интенсивности, чтобы иметь к ней доступ в обработчиках
  const intensityRef = useRef(0); 

  const MOUSE_INFLUENCE = 0.35;
  const mouseRef = useRef({ x:0, y:0, lastX:0, lastY:0, deltaX:0, deltaY:0 });
  
  const stopFire = () => {
    stopRef.current = true;
  }
  useEffect(() => {
    if (!canvasRef.current || !overlayRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let fireX, fireY;
    const particles = [];
    let smoothFireIntensity = 0; // Внутренняя переменная для плавности
    let flickerTime = 0;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      fireX = width / 2;
      fireY = height * 0.63;
      ctx.globalCompositeOperation = "screen";
    }

    function handleActive() {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        lastReturnTimeRef.current = Date.now();
      }
    }

    function handleInactive() {
      isActiveRef.current = false;
      // Сбрасываем интенсивность в 0, чтобы при возврате огонь начинал расти с минимума
      smoothFireIntensity = 0;
    }

    function handleVisibilityChange() {
      document.visibilityState === "visible" ? handleActive() : handleInactive();
    }

    function handleKeyDown() { keysPressedRef.current = true; }
    function handleKeyUp() { keysPressedRef.current = false; }
    function handleMouseMove(e) { updateMouseVector(mouseRef, e); }

    function update() {
      if (stopRef.current) return;
      const now = Date.now();
      const params = getCurrentStage(startTimeRef, totalTime);
      const mouse = mouseRef.current;
      const isActive = isActiveRef.current;
      
      const timeSinceReturn = now - lastReturnTimeRef.current;
      // Дым идет пока мы неактивны + 2 секунды после возврата
      const isSmokeyMode = !isActive || (timeSinceReturn < 2000);
      
      // Коэффициент прогресса разгорания (от 0 до 1 за 4 секунды)
      const warmupProgress = !isActive ? 0 : Math.min(timeSinceReturn / 4000, 1);

      // Эмит рейт: если неактивно - 1 частица, если активно - плавно растет до нормы
      const baseMinEmit = 0.5;
      const currentEmitRate = isActive 
        ? baseMinEmit + (params.EMIT_RATE - baseMinEmit) * warmupProgress 
        : baseMinEmit;

      for (let i = 0; i < currentEmitRate; i++) {
        if (Math.random() > (currentEmitRate % 1) && i >= Math.floor(currentEmitRate)) continue;
        
        const angle = Math.random() * Math.PI - Math.PI / 2;
        const radius = params.SPAWN_RADIUS * Math.pow(Math.random(), 1/10);
        const spawnX = fireX - radius * Math.sin(angle);
        const spawnY = fireY + radius * Math.cos(angle);
        particles.push(new Particle(spawnX, spawnY, angle, params, fireX, fireY));
      }

      ctx.clearRect(0,0,width,height);
      let coreParticles = 0;

      particles.forEach((p, i) => {
        const t = p.life / p.params.MAX_LIFE;
        const lifeRatio = 1 - t;

        let r, g, b;
        
        // Цвет: Дым (серый) или Огонь (цветной)
        if (isSmokeyMode) {
          // Делаем дым чуть более выраженным в режиме неактивности
          const grayBase = 30 + (t * 40); 
          r = g = b = grayBase;
        } else {
          const hasCore = Math.abs(p.angle) <= p.params.CORE_ANGLE_LIMIT;
          if(hasCore && t < 0.04) { r=250; g=240; b=200; }
          else if(t < 0.08) { r=245; g=175; b=15; }
          else if(t < 0.55) { r=245; g=130; b=10; }
          else if(t < 0.75) { r=240; g=60; b=15; }
          else { 
            const k = (t - 0.75) / 0.25; 
            const gray = 40 * (1 - k); 
            r = g = b = gray; 
          }
        }

        const keyInfluence = (keysPressedRef.current && isActive) ? 0.85 : 1;
        // Дым прозрачнее огня
        const alpha = isSmokeyMode ? (lifeRatio * 0.06) : (lifeRatio * 0.1 * keyInfluence);
        
        ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${alpha})`;

        const size = lifeRatio * p.params.PARTICLE_SIZE;
        const baseWidth = size * 0.8;
        const heightTri = size * 1.6;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * (1 + t * 1.5));
        ctx.beginPath();
        ctx.moveTo(0, -heightTri);
        ctx.lineTo(-baseWidth, 0);
        ctx.lineTo(baseWidth, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        p.vx += (mouse.deltaX/200)*MOUSE_INFLUENCE;
        p.vy += (mouse.deltaY/200)*MOUSE_INFLUENCE;
        p.x += p.vx*lifeRatio;
        p.y += p.vy;
        p.x += (Math.random()-0.5) * p.params.FLAME_TURBULENCE * lifeRatio;
        p.rotation += p.rotationSpeed*(1+t*2);
        p.life++;

        // Считаем горячие частицы только если мы не в режиме дыма
        if(!isSmokeyMode && Math.abs(p.angle) <= p.params.CORE_ANGLE_LIMIT && t < 0.12) {
          coreParticles++;
        }
        if(p.life >= p.params.MAX_LIFE) particles.splice(i,1);
      });

      // Скорость изменения интенсивности (0.02 для плавного разгорания)
      const targetIntensity = Math.min(coreParticles / 120, 1);
      smoothFireIntensity += (targetIntensity - smoothFireIntensity) * 0.02;
      
      flickerTime += 0.015;
      const flicker = Math.sin(flickerTime)*0.06 + Math.sin(flickerTime*0.5)*0.04;
      const finalIntensity = Math.max(0, smoothFireIntensity + flicker);

      const overlay = overlayRef.current;
      if(overlay){
        const radiusInner = 8 + finalIntensity*18;
        const radiusMid = 22 + finalIntensity*35;
        const radiusOuter = 45 + finalIntensity*70;

        // Переход цвета фона от тускло-серого к огненному
        const mix = isSmokeyMode ? 0 : warmupProgress;
        const rVal = 60 + (195 * mix);
        const gVal = 60 + (100 * mix);
        const bVal = 60 - (20 * mix);

        overlay.style.background = `
          radial-gradient(
            circle at ${fireX}px ${fireY}px,
            rgba(${rVal|0},${gVal|0},${bVal|0},${0.05 + finalIntensity*0.35}) 0%,
            rgba(${rVal-50|0},${gVal-80|0},20,${0.02 + finalIntensity*0.25}) ${radiusInner}%,
            rgba(20,10,5,0.1) ${radiusMid}%,
            rgba(0,0,0,0.8) ${radiusOuter}%
          )
        `;
      }

      mouse.deltaX *= 0.9;
      mouse.deltaY *= 0.9;

      requestAnimationFrame(update);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleInactive);
    window.addEventListener("focus", handleActive);

    update();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleInactive);
      window.removeEventListener("focus", handleActive);
    };
  }, [canvasRef, overlayRef, totalTime]);
  return { stopFire };
}