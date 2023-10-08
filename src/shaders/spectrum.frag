#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;

uniform sampler2D uMatCap;
uniform float uSpecterSize;   // responsible for creating the wave effect, called in SpectrumClass.js init()
uniform float uWaveBorder;   // responsible for creating the border to the wave effect above, called in SpectrumClass.js init()
uniform float uWaveSpeed;    // wave speed, called in SpectrumClass.js MyGUI component!
uniform vec3 uBorderColor;  // responsible for creating the color of the border for uWaveBorder, called in SpectrumClass.js init()
uniform float uTime;        // time in seconds, responsible for animating the wave effect

void main() {
    float n3 = snoise3(vec3(vPosition.xz * 5.0, uTime * uWaveSpeed)) * 0.5;    // creates noise wave, thanks to glsl-noise npm package

    float w = sin(vPosition.y * 5.0 - uTime * 0.2);

    // Creates a color border to the imported material matcap
    float borderMask = step(w, n3 - uSpecterSize);
    borderMask -= step(w, n3 - (uSpecterSize + uWaveBorder));
    vec4 borderOut = vec4(uBorderColor * borderMask, borderMask);

    float mcMask = step(w, n3 - uSpecterSize);    // determines animation of wave effect

    vec4 matCap = texture2D(uMatCap, vMatCapUV);
    vec4 matCapOut = vec4(matCap.rgb, mcMask);

    float opMask = 1.0 - vPosition.y;
    opMask *= 0.15;
    opMask += 0.5;

    vec4 opMaskOut = vec4(1.0, 1.0, 1.0, opMask);

    //  Add both the wave effect and the border to the final shader vector
    vec4 col = matCapOut + borderOut;
    col *= opMaskOut;

    gl_FragColor = vec4(col);
}