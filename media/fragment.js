export const shader_code = `
precision highp float;

varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec2 vUVCoord;

uniform sampler2D uTex1;
uniform sampler2D uTex2;

uniform vec4 uTeamColor;
uniform vec3 uSunDir;
uniform vec3 uSunAmbientModel;
uniform vec3 uSunDiffuseModel;

void main(void) {
	vec4 texColor1 = texture2D(uTex1, vUVCoord);
 	vec4 texColor2 = texture2D(uTex2, vUVCoord);

 	gl_FragColor.a = uTeamColor.a * float(texColor2.a >= 0.5);
	if (gl_FragColor.a <= 0.0)
		discard;

	vec3 L = normalize(uSunDir);
	vec3 N = normalize(vWorldNormal);
	float NdotL = clamp(dot(N, L), 0.0, 1.0);
	vec3 light = uSunAmbientModel + (NdotL * uSunDiffuseModel) + texColor2.rrr;
	gl_FragColor.rgb = mix(texColor1.rgb, uTeamColor.rgb, texColor1.a) * light;
}`;
