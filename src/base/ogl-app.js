import { Renderer, Camera, Transform, Orbit } from 'ogl';
import Clock from './clock';

const NOOP = () => {};

function toLocalCoords(domElement, mouseEvent) {
  const rect = domElement.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  return [x, y];
}

export default class OGLApp {
  constructor({
    target = document.body,
    pixelRatio = window.devicePixelRatio,
    autoResize = true,
    orbitControls = false,
    transparent = false,
    onRenderCallback = NOOP,
    onResizeCallback = NOOP,
    onMouseMoveCallback = NOOP,
    onMouseClickCallback = NOOP,
  }) {
    this.transparent = transparent;
    this.autoResize = autoResize;
    this.pixelRatio = pixelRatio;
    this.onResizeCallback = onResizeCallback;
    this.onRenderCallback = onRenderCallback;
    this.onMouseClickCallback = onMouseClickCallback;
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.features = { orbitControls };
    this.clock = new Clock();

    // Renderer
    const renderer = new Renderer({ dpr: pixelRatio, alpha: transparent });
    const gl = renderer.gl;
    this.renderer = renderer;
    target.appendChild(gl.canvas);
    if (!transparent) {
      gl.clearColor(0, 0, 0, 1);
    }

    // Camera & Scene
    const camera = new Camera(gl, { near: 0.1, far: 1000 });
    camera.position.set(1, 1, 5);
    this.camera = camera;
    this.scene = new Transform();

    // Features
    if (orbitControls) {
      const controls = new Orbit(camera);
      this.orbitControls = controls;
    }

    // Mouse Events
    const { canvas } = gl;
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('click', this.onMouseClick.bind(this));
  }

  resize(width, height) {
    const { renderer, camera } = this;
    if (this.width !== width || this.height !== height) {
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      this.onResizeCallback(width, height);
    }
  }

  start() {
    this.onRender();
    return this;
  }

  resizeToWindowSize() {
    const { innerWidth, innerHeight } = window;
    this.resize(innerWidth, innerHeight);
  }

  onMouseClick(event) {
    const [x, y] = toLocalCoords(this.canvas, event);
    this.onMouseClickCallback({ x, y, event });
  }

  onMouseMove(event) {
    const [x, y] = toLocalCoords(this.canvas, event);
    this.onMouseMoveCallback({ x, y, event });
  }

  onRender() {
    const { clock, scene, camera, renderer, autoResize, features, orbitControls } = this;
    if (autoResize) this.resizeToWindowSize();
    if (features.orbitControls) orbitControls.update();
    this.onRenderCallback({
      delta: clock.getDelta(),
      elapsedTime: clock.getElapsedTime(),
      scene,
      camera,
      renderer,
    });
    window.requestAnimationFrame(this.onRender.bind(this));
  }

  get gl() {
    return this.renderer.gl;
  }

  get canvas() {
    const { renderer } = this;
    return renderer.gl.canvas;
  }

  get width() {
    return this.renderer.width;
  }

  get height() {
    return this.renderer.height;
  }

}