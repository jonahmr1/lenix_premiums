// FiveM's game-texture binding sequence is adapted from gtasnail/fivem-glsl.

const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
	uv = position * 0.5 + 0.5;
	gl_Position = vec4(position, 0.0, 1.0);
}`

const fragmentSource = `
precision highp float;
uniform sampler2D game;
uniform vec4 region;
uniform vec2 viewport;
uniform float radius;
varying vec2 uv;
void main() {
	vec2 screenUV = vec2(
		(region.x + uv.x * region.z) / viewport.x,
		1.0 - (region.y + (1.0 - uv.y) * region.w) / viewport.y
	);
	vec3 color = vec3(0.0);
	float total = 0.0;
	// Fixed 25-tap kernel: increasing the radius does not add texture reads.
	for (int x = -2; x <= 2; x++) {
		for (int y = -2; y <= 2; y++) {
			vec2 offset = vec2(float(x), float(y));
			float weight = exp(-dot(offset, offset) * 0.5);
			vec2 sampleUV = clamp(screenUV + offset * radius * 0.5 / viewport, 0.0, 1.0);
			color += texture2D(game, sampleUV).rgb * weight;
			total += weight;
		}
	}
	// CSS backgrounds and gradients are composited above this game-only layer.
	gl_FragColor = vec4(color / total, 1.0);
}`

export const isFiveM = () => typeof window !== 'undefined' && 'invokeNative' in window

export function createGameBlur(canvas: HTMLCanvasElement, resolutionScale = 0.5) {
	const gl = canvas.getContext('webgl', {
		alpha: true,
		antialias: false,
		depth: false,
		stencil: false,
		preserveDrawingBuffer: false,
	})
	if (!gl) throw new Error('WebGL is unavailable')

	const shaders: WebGLShader[] = []
	let program: WebGLProgram | null = null
	let texture: WebGLTexture | null = null
	let buffer: WebGLBuffer | null = null
	const dispose = () => {
		gl.deleteBuffer(buffer)
		gl.deleteTexture(texture)
		gl.deleteProgram(program)
		shaders.forEach(shader => gl.deleteShader(shader))
	}

	try {
		const compile = (type: number, source: string) => {
			const shader = gl.createShader(type)
			if (!shader) throw new Error('Cannot allocate blur shader')
			shaders.push(shader)
			gl.shaderSource(shader, source)
			gl.compileShader(shader)
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw new Error(gl.getShaderInfoLog(shader) || 'Cannot compile blur shader')
			}
			return shader
		}

		program = gl.createProgram()
		if (!program) throw new Error('Cannot allocate blur program')
		gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource))
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource))
		gl.linkProgram(program)
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(program) || 'Cannot link blur program')
		}
		gl.useProgram(program)

		texture = gl.createTexture()
		buffer = gl.createBuffer()
		if (!texture || !buffer) throw new Error('Cannot allocate blur resources')
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		// This exact sequence tells FiveM to bind the live game texture.
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.uniform1i(gl.getUniformLocation(program, 'game'), 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
		const position = gl.getAttribLocation(program, 'position')
		gl.enableVertexAttribArray(position)
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
		const region = gl.getUniformLocation(program, 'region')
		const viewport = gl.getUniformLocation(program, 'viewport')
		const radius = gl.getUniformLocation(program, 'radius')

		return {
			draw(blur: number) {
				const rect = canvas.getBoundingClientRect()
				if (!rect.width || !rect.height) return
				// Deliberately use CSS pixels, not devicePixelRatio, to bound GPU work.
				const width = Math.max(1, Math.ceil(rect.width * resolutionScale))
				const height = Math.max(1, Math.ceil(rect.height * resolutionScale))
				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width
					canvas.height = height
					gl.viewport(0, 0, width, height)
				}
				gl.uniform4f(region, rect.left, rect.top, rect.width, rect.height)
				gl.uniform2f(viewport, window.innerWidth, window.innerHeight)
				gl.uniform1f(radius, blur)
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
			},
			dispose,
		}
	} catch (error) {
		dispose()
		throw error
	}
}
