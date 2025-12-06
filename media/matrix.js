export function M33xM3(a, b)
{
	return new Float32Array([
		b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
		b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
		b[0] * a[2] + b[1] * a[5] + b[2] * a[8]
	]);
}

export function M44xM4(a, b)
{
	return new Float32Array([
		b[ 0] * a[ 0] + b[ 1] * a[ 4] + b[ 2] * a[ 8] + b[ 3] * a[12],
		b[ 0] * a[ 1] + b[ 1] * a[ 5] + b[ 2] * a[ 9] + b[ 3] * a[13],
		b[ 0] * a[ 2] + b[ 1] * a[ 6] + b[ 2] * a[10] + b[ 3] * a[14],
		b[ 0] * a[ 3] + b[ 1] * a[ 7] + b[ 2] * a[11] + b[ 3] * a[15],
	]);
}

export function M44xM44(a, b)
{
	return new Float32Array([
		b[ 0] * a[ 0] + b[ 1] * a[ 4] + b[ 2] * a[ 8] + b[ 3] * a[12],
		b[ 0] * a[ 1] + b[ 1] * a[ 5] + b[ 2] * a[ 9] + b[ 3] * a[13],
		b[ 0] * a[ 2] + b[ 1] * a[ 6] + b[ 2] * a[10] + b[ 3] * a[14],
		b[ 0] * a[ 3] + b[ 1] * a[ 7] + b[ 2] * a[11] + b[ 3] * a[15],
		b[ 4] * a[ 0] + b[ 5] * a[ 4] + b[ 6] * a[ 8] + b[ 7] * a[12],
		b[ 4] * a[ 1] + b[ 5] * a[ 5] + b[ 6] * a[ 9] + b[ 7] * a[13],
		b[ 4] * a[ 2] + b[ 5] * a[ 6] + b[ 6] * a[10] + b[ 7] * a[14],
		b[ 4] * a[ 3] + b[ 5] * a[ 7] + b[ 6] * a[11] + b[ 7] * a[15],
		b[ 8] * a[ 0] + b[ 9] * a[ 4] + b[10] * a[ 8] + b[11] * a[12],
		b[ 8] * a[ 1] + b[ 9] * a[ 5] + b[10] * a[ 9] + b[11] * a[13],
		b[ 8] * a[ 2] + b[ 9] * a[ 6] + b[10] * a[10] + b[11] * a[14],
		b[ 8] * a[ 3] + b[ 9] * a[ 7] + b[10] * a[11] + b[11] * a[15],
		b[12] * a[ 0] + b[13] * a[ 4] + b[14] * a[ 8] + b[15] * a[12],
		b[12] * a[ 1] + b[13] * a[ 5] + b[14] * a[ 9] + b[15] * a[13],
		b[12] * a[ 2] + b[13] * a[ 6] + b[14] * a[10] + b[15] * a[14],
		b[12] * a[ 3] + b[13] * a[ 7] + b[14] * a[11] + b[15] * a[15]
	]);
}

export function closedPerspective90VFov(aspect, near, far) {
    const nf = 1 / (near - far);
	return new Float32Array([
  		aspect, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, (far + near) * nf, -1,
		0, 0, 2 * far * near * nf, 0
	]);
}

export function Identity4() {
	return new Float32Array([
		1, 0, 0, 0,  
		0, 1, 0, 0,  
		0, 0, 1, 0,  
		0, 0, 0, 1
	]);
}

export function Translation4(x, y, z)
{
	return new Float32Array([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	]);
}

export function Scale4(x, y, z)
{
	return new Float32Array([x, 0, 0, 0,  0, y, 0, 0,  0, 0, z, 0,  0, 0, 0, 1]);
}

export function Rotation4(rad, x, y, z)
{
	const s = Math.sin(rad);
	const c = Math.cos(rad);
	const t = 1 - c;
	return new Float32Array([
		x * x * t + c    , y * x * t + z * s, z * x * t - y * s, 0,
		x * y * t - z * s, y * y * t + c    , z * y * t + x * s, 0,
		x * z * t + y * s, y * z * t - x * s, z * z * t + c    , 0,
		0, 0, 0, 1
	]);
}

export function V3aV3(a, b) {
	return new Float32Array([a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
}

export function V3(x, y, z) {
	return new Float32Array([x, y, z]);
}

export function V4(x, y, z, w) {
	return new Float32Array([x, y, z, w]);
}

export function ToV3(m) {
	return new Float32Array([
		m[ 0], m[ 1], m[ 2],
	]);
}

export function Opposite(m) {
	return m.map(i => -i);
}

export function MmS(m, s) {
	return m.map(i => i * s);
}