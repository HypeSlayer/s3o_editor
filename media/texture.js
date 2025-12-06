export function initTexture(gl) {
	const texture = gl.createTexture();	
	resetTexture(gl, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	return texture;
}

export function resetTexture(gl, texture) {
	const level = 0;
	const width = 1;
	const height = 1;
	const border = 0;
	const pixel = new Uint8Array([ 255, 255, 255, 255 ]);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, border, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
}

export function loadTexture(gl, texture, data) {
	const level = 0;
	const border = 0;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	const raw = new Uint8Array(data.pixel);
	if (data.compressed)
		gl.compressedTexImage2D(gl.TEXTURE_2D, level, gl.getExtension(data.extension)[data.format], data.width, data.height, border, raw);
	else
		gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, data.width, data.height, border, gl.RGBA, gl.UNSIGNED_BYTE, raw);
}
