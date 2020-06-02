import OGLApp from './base/ogl-app';
import { GLTFLoader, TextureLoader, Box, Program, Mesh, Vec2, Vec3, Post } from 'ogl';
import postFragment from './shaders/post-fragment';
import matcapVertex from './shaders/matcap-vertex.glsl';
import matcapFragment from './shaders/matcap-fragment.glsl';
import matcap from '../assets/textures/blue-matcap.png';

import icoshphere from '../assets/models/icosphere.gltf';
import torus from '../assets/models/torus.gltf';
import knot from '../assets/models/knot.gltf';

class Demo {
  constructor() {
    this.selectedIndex = 0;
    this.models = [];
    this.app = new OGLApp({
      onRenderCallback: this.onRender.bind(this),
      onResizeCallback: this.onResize.bind(this),
      orbitControls: true,
    });
    this.setup();
    this.app.start();
  }

  async setup() {
    const { gl, scene, camera } = this.app;
    camera.position.set(0, 0, 10);

    this.postfx = {
      post: new Post(gl),
      resolution: { value: new Vec2() },
    };
    this.postfx.post.addPass({
      fragment: postFragment,
      uniforms: {

        uResolution: this.postfx.resolution,
      }
    });

    await Promise.all([
      this.addModel(icoshphere),
      //this.addModel(torus, 'torus'),
      //this.addModel(knot, 'knot'),
    ]);
  }

  async addModel(url) {
    const { models } = this;
    const { gl, scene } = this.app;
    const gltf = await GLTFLoader.load(gl, url);

    const matcapTexture = TextureLoader.load(gl, { src: matcap });

    scene.children.forEach((child) => child.setParent(null));
    gltf.scene.forEach((root) => {
      root.setParent(scene);
      root.traverse(obj => {
        if (obj.program) {
          obj.program = new Program(gl, {
            vertex: matcapVertex,
            fragment: matcapFragment,
            transparent: false,
            uniforms: {
              uColor: { value: new Vec3(0, 1, 1) },
              tMap: { value: matcapTexture },
            },
            cullFace: gl.BACK,
          });
          models.push(obj);
        }
      });
    })
  }

  selectModel(index) {

  }

  onResize(width, height) {
    const { postfx } = this;
    postfx.post.resize();
    postfx.resolution.value.set(width, height);
    console.log('Resize', width, height);
  }

  onRender({ elapsedTime, delta, scene, camera, renderer }) {
    const { models } = this;
    //models.forEach(m => {
      //m.program.uniforms.uTime.value += delta;
    //});
    //renderer.render({ scene, camera });
    this.postfx.post.render({scene, camera});
  }
}

new Demo();