#version 300 es
precision highp float;

in vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec4 vPos;

void main() {
  vPos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * vPos;
}
