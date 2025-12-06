import { initBuffers, updateBuffers } from "./buffers.js";
import { drawScene } from "./drawScene.js";
import { initShaderProgram } from "./shaders.js";
import * as tex from "./texture.js";
import * as mat from "./matrix.js";

main();

function main() {
  const canvas = document.getElementById("S3OPreview");
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) 
    return console.error("Unable to initialize WebGL2. Your browser or machine may not support it.");

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const shaderProgram = initShaderProgram(gl);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      cameraMatrix: gl.getUniformLocation(shaderProgram, "uCameraMatrix"),
      worldTranslation: gl.getUniformLocation(shaderProgram, "uWorldTranslation"),
      tex1: gl.getUniformLocation(shaderProgram, "uTex1"),
      tex2: gl.getUniformLocation(shaderProgram, "uTex2"),
      teamColor: gl.getUniformLocation(shaderProgram, "uTeamColor"),
      sunDir: gl.getUniformLocation(shaderProgram, "uSunDir"),
      sunAmbientModel: gl.getUniformLocation(shaderProgram, "uSunAmbientModel"),
      sunDiffuseModel: gl.getUniformLocation(shaderProgram, "uSunDiffuseModel"),
    },
  };

  const buffers = initBuffers(gl);
  const tex1 = tex.initTexture(gl);
  const tex2 = tex.initTexture(gl);
  
  let rots = mat.Identity4();
  let zoom = 1.2;
  function render() {
    drawScene(gl, programInfo, buffers, tex1, tex2, rots, zoom);
  }
  render();

  {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('mousemove', e => {
      if (isDragging) {
        rots = mat.M44xM44(mat.M44xM44(mat.Rotation4((e.clientX - lastX) / 300, 0, 1, 0), mat.Rotation4((e.clientY - lastY) / 300, 1, 0, 0)), rots);
        lastX = e.clientX;
        lastY = e.clientY;
        render();
      }
    });
    function handleMouseUp(e) {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseup', handleMouseUp); 
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const zoomfactor = 0.9;
      zoom *= e.deltaY < 0 ? zoomfactor : 1 / zoomfactor;      
      render();
    });
  }

  window.addEventListener("message", event => {
    const message = event.data;
    switch (message.command) {
      case "data":
        tex.resetTexture(gl, tex1);
        tex.resetTexture(gl, tex2);
        updateBuffers(gl, buffers, message.data);
        rots = mat.Identity4();
        zoom = 2.1 * buffers.radius;
        render();
        break;
      case "texture1":
        tex.loadTexture(gl, tex1, message.data);
        render();
        break;
      case "texture2":
        tex.loadTexture(gl, tex2, message.data);
        render();
        break;
    }
  });

  acquireVsCodeApi().postMessage({ command: "ready" });
}  
