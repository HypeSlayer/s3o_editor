export const shader_code = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uCameraMatrix;
uniform vec3 uWorldTranslation;

varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec2 vUVCoord;

void main(void) {
	vWorldPos = uWorldTranslation + aVertexPosition;
	vWorldNormal = aVertexNormal;
	gl_Position = uCameraMatrix * vec4(vWorldPos, 1.0);
	vUVCoord = aTextureCoord;
}`;
