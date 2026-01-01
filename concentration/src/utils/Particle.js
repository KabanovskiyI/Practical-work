export class Particle {
  constructor(x, y, angle, params, fireX, fireY) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.params = params;

    const dirX = fireX - x;
    const dirY = fireY - y;
    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

    this.vx = (dirX / len) * params.FLAME_SPREAD;
    this.vy = -params.FLAME_RISE_SPEED * (0.6 + Math.random() * 0.4);

    if (Math.random() < params.CENTER_PULL_PROB) {
      this.vx += (Math.random() - 0.5) * params.FLAME_SPREAD * 2;
      this.vy += (Math.random() - 0.5) * params.FLAME_RISE_SPEED * 0.5;
    }

    this.rotation = angle * 0.7 + (Math.random() - 0.5) * 1.4;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    this.life = 0;
  }
}
