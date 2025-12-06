import * as vertex from "./vertex.js"
import * as fragment from "./fragment.js"

export function initShaderProgram(gl) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertex.shader_code);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment.shader_code);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    return console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
