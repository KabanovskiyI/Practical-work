export const fireStages = [
  {
    MAX_LIFE: 100,
    EMIT_RATE: 6,
    PARTICLE_SIZE: 10,
    FLAME_RISE_SPEED: 1.2,
    FLAME_SPREAD: 0.25,
    FLAME_TURBULENCE: 4,
    SPAWN_RADIUS: 15,
    CENTER_PULL_PROB: 0.2,
    CORE_ANGLE_LIMIT: (20 * Math.PI) / 180,
  },
  {
    MAX_LIFE: 120,
    EMIT_RATE: 8,
    PARTICLE_SIZE: 12,
    FLAME_RISE_SPEED: 1.4,
    FLAME_SPREAD: 0.3,
    FLAME_TURBULENCE: 5,
    SPAWN_RADIUS: 25,
    CENTER_PULL_PROB: 0.2,
    CORE_ANGLE_LIMIT: (20 * Math.PI) / 180,
  },
  {
    MAX_LIFE: 150,
    EMIT_RATE: 10,
    PARTICLE_SIZE: 15,
    FLAME_RISE_SPEED: 1.5,
    FLAME_SPREAD: 0.35,
    FLAME_TURBULENCE: 6,
    SPAWN_RADIUS: 35,
    CENTER_PULL_PROB: 0.2,
    CORE_ANGLE_LIMIT: (20 * Math.PI) / 180,
  },
  {
    MAX_LIFE: 180,
    EMIT_RATE: 12,
    PARTICLE_SIZE: 18,
    FLAME_RISE_SPEED: 1.6,
    FLAME_SPREAD: 0.4,
    FLAME_TURBULENCE: 7,
    SPAWN_RADIUS: 40,
    CENTER_PULL_PROB: 0.2,
    CORE_ANGLE_LIMIT: (20 * Math.PI) / 180,
  },
  {
    MAX_LIFE: 200,
    EMIT_RATE: 14,
    PARTICLE_SIZE: 20,
    FLAME_RISE_SPEED: 1.8,
    FLAME_SPREAD: 0.45,
    FLAME_TURBULENCE: 8,
    SPAWN_RADIUS: 50,
    CENTER_PULL_PROB: 0.2,
    CORE_ANGLE_LIMIT: (20 * Math.PI) / 180,
  },
];

export function getStageByPercent(percent) {
  const index = Math.min(
    Math.floor((percent / 100) * fireStages.length),
    fireStages.length - 1
  );
  return fireStages[index];
}
