precision highp float;
uniform sampler2D tMap;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec4 raw = texture2D(tMap, vUv);
  // mess with the fragment here
  gl_FragColor = raw;
}