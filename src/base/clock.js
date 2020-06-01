//Direct port from https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js

export default class Clock {
  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;
    this.running = 0;
  }

  start() {
    this.startTime = performance.now();
    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }

  stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElapsedTime() {
    this.getDelta();
    return this.elapsedTime;
  }

  getDelta() {
    const { running, oldTime, autoStart } = this;
    let diff = 0;
    if (autoStart && !running) {
      this.start();
      return 0;
    }

    if (running) {
      const newTime = performance.now();
      diff = (newTime - oldTime) / 1000;
      this.oldTime = newTime;
      this.elapsedTime += diff;
    }

    return diff;
  }
}