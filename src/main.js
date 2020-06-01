import OGLApp from './base/ogl-app';
import { Box, Program, Mesh } from 'ogl';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

class Demo {
  constructor() {
    this.app = new OGLApp({
      onRenderCallback: this.onRender.bind(this),
      onResizeCallback: this.onResize.bind(this),
      orbitControls: true,
    });
    this.setup();
    this.app.start();
  }

  setup() {
    const { gl, scene } = this.app;
    const program = new Program(gl, { vertex, fragment });
    const geometry = new Box(gl);
    const mesh = new Mesh(gl, { geometry, program });
    mesh.position.set(0, 0, 0);
    mesh.setParent(scene);
    this.cube = mesh;
  }

  onResize(width, height) {
    console.log('Resize', width, height);
  }

  onRender({ elapsedTime, delta, scene, camera, renderer }) {
    this.cube.rotation.x += delta;
    this.cube.rotation.y += delta;
    renderer.render({ scene, camera });
  }
}

new Demo();