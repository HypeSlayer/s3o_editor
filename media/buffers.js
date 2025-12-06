import * as mat from "./matrix.js";

export function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);
  const textureCoordBuffer = initTextureBuffer(gl);
  const indexBuffer = initIndexBuffer(gl);
  const normalBuffer = initNormalBuffer(gl);
  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
    radius: Math.sqrt(3),
    midinv: mat.V3(0, 0, 0),
    root: {
      name: "def-cube",
      transform: mat.V3(0, 0, 0),
      type: gl.TRIANGLES,
      offset: 0,
      size: 36,
      children: [{
        name: "front",
        transform: mat.V3(0, 0, +1),
        type: gl.TRIANGLES,
        offset: 0,
        size: 6,
        children: []
      },{
        name: "back",
        transform: mat.V3(0, 0, -1),
        type: gl.TRIANGLES,
        offset: 6,
        size: 6,
        children: []
      },{
        name: "top",
        transform: mat.V3(0, +1, 0),
        type: gl.TRIANGLES,
        offset: 12,
        size: 6,
        children: []
      },{
        name: "bottom",
        transform: mat.V3(0, -1, 0),
        type: gl.TRIANGLES,
        offset: 18,
        size: 6,
        children: []
      },{
        name: "right",
        transform: mat.V3(+1, 0, 0),
        type: gl.TRIANGLES,
        offset: 24,
        size: 6,
        children: []
      },{
        name: "left",
        transform: mat.V3(-1, 0, 0),
        type: gl.TRIANGLES,
        offset: 30,
        size: 6,
        children: []
      }]
    }
  };
}

function initPositionBuffer(gl) {
  const positions = [
    -1.0, -1.0, +1.0,   +1.0, -1.0, +1.0,   +1.0, +1.0, +1.0,   -1.0, +1.0, +1.0,	// Front face
    -1.0, -1.0, -1.0,   -1.0, +1.0, -1.0,   +1.0, +1.0, -1.0,   +1.0, -1.0, -1.0,	// Back face
    -1.0, +1.0, -1.0,   -1.0, +1.0, +1.0,   +1.0, +1.0, +1.0,   +1.0, +1.0, -1.0,	// Top face
    -1.0, -1.0, -1.0,   +1.0, -1.0, -1.0,   +1.0, -1.0, +1.0,   -1.0, -1.0, +1.0,	// Bottom face
    +1.0, -1.0, -1.0,   +1.0, +1.0, -1.0,   +1.0, +1.0, +1.0,   +1.0, -1.0, +1.0,	// Right face
    -1.0, -1.0, -1.0,   -1.0, -1.0, +1.0,   -1.0, +1.0, +1.0,   -1.0, +1.0, -1.0,	// Left face
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  return positionBuffer;
}

function initIndexBuffer(gl) {
  const indices = [
     0,  1,  2,  0,  2,  3, // front
     4,  5,  6,  4,  6,  7, // back
     8,  9, 10,  8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23, // left
  ];

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return indexBuffer;
}

function initTextureBuffer(gl) {
  const textureCoordinates = [
    1.0, 1.0, 0.0, 1.0,	0.0, 0.0, 1.0, 0.0, // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,	// Back
    1.0, 1.0, 0.0, 1.0,	0.0, 0.0, 1.0, 0.0, // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,	// Bottom
    1.0, 1.0, 1.0, 0.0,	0.0, 0.0, 0.0, 1.0, // Right
    0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,	// Left
  ];

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  return textureCoordBuffer;
}

function initNormalBuffer(gl) {
  const vertexNormals = [
     0.0,  0.0, +1.0,  0.0,  0.0, +1.0,  0.0,  0.0, +1.0,  0.0,  0.0, +1.0,	// Front
     0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,	// Back
     0.0, +1.0,  0.0,  0.0, +1.0,  0.0,  0.0, +1.0,  0.0,  0.0, +1.0,  0.0,	// Top
     0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,	// Bottom
    +1.0,  0.0,  0.0, +1.0,  0.0,  0.0, +1.0,  0.0,  0.0, +1.0,  0.0,  0.0,	// Right
    -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,	// Left
  ];

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  return normalBuffer;
}

const MAX_UNSIGNED_SHORT = 65535;

export function updateBuffers(gl, buffers, data) {
  let firstVertex = 0;
  const pos = [];
  const nor = [];
  const tex = [];
  const ind = [];

  const points = [];

  function Piece(piece, parentTransform) {
    // Translate type and indices
    let type;
    const begin = ind.length;
    switch (piece.primitiveType) {
      case 2:
        // TODO Untested
        type = gl.TRIANGLE_FAN;
        for (let i = 0, c = Math.trunc(piece.indices.length / 4); i < c;)
        {
          if (i) ind.push(MAX_UNSIGNED_SHORT);
          ind.push(piece.indices[i++] + firstVertex);
          ind.push(piece.indices[i++] + firstVertex);
          ind.push(piece.indices[i++] + firstVertex);
          ind.push(piece.indices[i++] + firstVertex);
        }
        break; 
      case 1:
        // TODO Untested
        type = gl.TRIANGLE_STRIP;
        for (const i of piece.indices)
          ind.push(i < 0 ? MAX_UNSIGNED_SHORT : i + firstVertex);
        break; 
      case 0:
        type = gl.TRIANGLES;
        for (const i of piece.indices)
          ind.push(i + firstVertex);
        break;
    }
    const end = ind.length;

    // Transfer vertices
    const transform = mat.V3(piece.offset.x, piece.offset.y, piece.offset.z);
    const fullTransform = mat.V3aV3(parentTransform, transform);
    for (const ver of piece.vertices)
    {
      firstVertex++;

      pos.push(ver.pos.x);
      pos.push(ver.pos.y);
      pos.push(ver.pos.z);
      nor.push(ver.normal.x);
      nor.push(ver.normal.y);
      nor.push(ver.normal.z);
      tex.push(ver.tex.x);
      tex.push(ver.tex.y);

      points.push(mat.V3aV3(fullTransform, mat.V3(ver.pos.x, ver.pos.y, ver.pos.z)));
    }

    return {
      name : piece.name,
      transform: transform,
      type: type,
      offset: begin,
      size: end - begin,
      children: piece.children.map(i => Piece(i, fullTransform))
    };
  }
  const root = Piece(data.root, mat.V3(0,0,0));
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nor), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ind), gl.STATIC_DRAW);

  buffers.midinv = mat.V3(0,0,0);
  // Does not work properly: unknown cause, maybe some z-axis is off
  //buffers.midinv = mat.Opposite(getCenter(points));
  buffers.radius = getRadius(points, buffers.midinv);
  buffers.root = root;
}

function getCenter(points) {
  if (!points.length) return mat.V3(0,0,0);
  const min = points[0];
  const max = points[0];
  for (let j = 1, c = points.length; j < c; ++j) {
    const p = points[j];
    for (let i = 0; i < 3; ++i) {
      if (p[i] < min[i])
        min[i] = p[i];
      if (p[i] > max[i])
        max[i] = p[i];
    }
  }
  return mat.MmS(mat.V3aV3(min, max), 0.5);
}

function getRadius(points, invc) {
  return Math.sqrt(points.reduce((r2, p) => Math.max(r2, selfDot(mat.V3aV3(invc, p))), 0));
}

function selfDot(point) {
  return point.reduce((s, i) => s + i * i, 0);
}
