import { fireStages } from "./fireStages";

export function getPercentElapsed(startTimeRef, totalTime) {
  const elapsed = (Date.now() - startTimeRef.current) / 1000;
  return Math.min((elapsed / totalTime) * 100, 100);
}

export function getCurrentStage(startTimeRef, totalTime) {
  const percent = getPercentElapsed(startTimeRef, totalTime);
  const index = Math.min(
    Math.floor((percent / 100) * fireStages.length),
    fireStages.length - 1
  );
  return fireStages[index];
}

export function updateMouseVector(mouseRef, e) {
  const mouse = mouseRef.current;
  mouse.deltaX = e.clientX - mouse.lastX;
  mouse.deltaY = e.clientY - mouse.lastY;
  mouse.lastX = e.clientX;
  mouse.lastY = e.clientY;
}
