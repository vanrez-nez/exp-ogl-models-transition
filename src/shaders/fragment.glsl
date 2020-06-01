precision highp float;
precision highp int;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
    vec3 normal = normalize(vNormal);
    vec3 light = normalize(vec3(0.5, 1.0, -0.3));
    float shading = dot(normal, light) * 0.15;
    gl_FragColor.rgb = vec3(shading);
    gl_FragColor.a = 1.0;
}