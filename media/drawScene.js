import * as mat from "./matrix.js";

export function drawScene(gl, programInfo, buffers, tex1, tex2, rots, zoom) {
  const view = mat.M44xM44(mat.Translation4(0, 0, - zoom), rots);
  const proj = mat.closedPerspective90VFov(gl.canvas.clientHeight / gl.canvas.clientWidth, 0.01, buffers.radius * 100);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(programInfo.uniformLocations.cameraMatrix, false, mat.M44xM44(proj, view));
  gl.uniform4fv(programInfo.uniformLocations.teamColor, mat.V4(1, 0, 1, 0.75));
  gl.uniform3fv(programInfo.uniformLocations.sunDir, mat.V3(0, 1, 0));
  gl.uniform3fv(programInfo.uniformLocations.sunAmbientModel, mat.V3(0.2, 0.2, 0.2));
  gl.uniform3fv(programInfo.uniformLocations.sunDiffuseModel, mat.V3(0.5, 0.5, 0.5));

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, tex2);
  gl.uniform1i(programInfo.uniformLocations.tex2, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex1);
  gl.uniform1i(programInfo.uniformLocations.tex1, 0);

  setAttribute(gl, buffers.position, programInfo.attribLocations.vertexPosition, 3);
  setAttribute(gl, buffers.textureCoord, programInfo.attribLocations.textureCoord, 2);
  setAttribute(gl, buffers.normal, programInfo.attribLocations.vertexNormal, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  drawPiece(gl, programInfo, buffers.root, buffers.midinv);
}

function setAttribute(gl, buffer, location, numComponents) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(location, numComponents, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location);
}

function drawPiece(gl, programInfo, piece, parentTransform) {
  const transform = mat.V3aV3(parentTransform, piece.transform);
  if (piece.size)
  {
    gl.uniform3fv(programInfo.uniformLocations.worldTranslation, transform);
    gl.drawElements(piece.type, piece.size, gl.UNSIGNED_SHORT, piece.offset * 2);
  }
  for (const child of piece.children)
    drawPiece(gl, programInfo, child, transform);
}
