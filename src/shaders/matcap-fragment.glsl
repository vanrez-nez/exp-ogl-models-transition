#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec3 uColor;
in vec4 vPos;
out vec4 FragColor;

vec3 normals(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
  return reflected.xy / m + 0.5;
}

void main() {
  vec3 normal = normals(vPos.xyz);
  float mat = texture(tMap, matcap(normalize(vPos.xyz), normal)).g;
  FragColor.rgb = uColor * mat;
  FragColor.a = 1.0;
}