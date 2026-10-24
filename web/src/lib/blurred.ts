import { createGameBlur, isFiveM } from './game-blur'

const selector = '[class*="blurred-"]'
const hasBlurClass = (element: Element) => [...element.classList].some(name => /(?:^|:)blurred-\d+$/.test(name))
type Panel = {
	canvas: HTMLCanvasElement
	visible: boolean
	failed: boolean
	lost: boolean
	background: string
	color: Float32Array
	renderer?: ReturnType<typeof createGameBlur>
	cleanup: () => void
}

/** Enable blurred-8 + bg-black/40 on ordinary elements, without React wrappers. */
export function installBlurred() {
	const native = isFiveM()
	const panels = new Map<HTMLElement, Panel>()
	let frame = 0
	let queued = false
	let disposed = false
	let colorContext: CanvasRenderingContext2D | null = null
	document.documentElement.dataset.gameBlur = native ? 'native' : 'browser'

	const stop = () => {
		cancelAnimationFrame(frame)
		frame = 0
	}
	const schedule = () => {
		if (!native || disposed || document.hidden || frame) return
		if ([...panels.values()].some(panel => panel.visible && !panel.failed && !panel.lost)) {
			frame = requestAnimationFrame(render)
		}
	}
	function render() {
		frame = 0
		for (const [element, panel] of panels) {
			if (!panel.visible || panel.failed || panel.lost || !element.isConnected) continue
			const style = getComputedStyle(element)
			const strength = Math.min(20, Math.max(0, Number(style.getPropertyValue('--game-blur')) || 0))
			if (!strength || style.visibility !== 'visible' || Number(style.opacity) === 0) {
				panel.canvas.hidden = true
				continue
			}
			try {
				if (style.backgroundColor !== panel.background) {
					if (!colorContext) {
						const swatch = document.createElement('canvas')
						swatch.width = swatch.height = 1
						colorContext = swatch.getContext('2d', { willReadFrequently: true })
					}
					if (!colorContext) throw new Error('Cannot read background colour')
					colorContext.clearRect(0, 0, 1, 1)
					colorContext.fillStyle = style.backgroundColor
					colorContext.fillRect(0, 0, 1, 1)
					const rgba = colorContext.getImageData(0, 0, 1, 1).data
					panel.color.set(rgba)
					for (let i = 0; i < 4; i++) panel.color[i] /= 255
					panel.background = style.backgroundColor
				}
				// An opaque background completely covers the blur.
				if (panel.color[3] === 1) {
					panel.canvas.hidden = true
					continue
				}
				panel.renderer ??= createGameBlur(panel.canvas)
				panel.canvas.hidden = false
				panel.renderer.draw(strength, panel.color)
			} catch (error) {
				panel.failed = true
				panel.canvas.hidden = true
				panel.renderer?.dispose()
				panel.renderer = undefined
				console.warn('[blurred] Using the CSS background without game blur:', error)
			}
		}
		schedule()
	}

	const intersection = new IntersectionObserver(entries => {
		for (const entry of entries) {
			const panel = panels.get(entry.target as HTMLElement)
			if (!panel) continue
			panel.visible = entry.isIntersecting
			if (!panel.visible) panel.canvas.hidden = true
		}
		schedule()
	})
	const remove = (element: HTMLElement, panel: Panel) => {
		intersection.unobserve(element)
		panel.cleanup()
		delete element.dataset.gameBlurPanel
		panels.delete(element)
	}
	const sync = () => {
		queued = false
		if (disposed) return
		for (const [element, panel] of panels) {
			if (!element.isConnected || !hasBlurClass(element)) remove(element, panel)
			// React can replace textContent and remove an injected canvas.
			else if (native && panel.canvas.parentElement !== element) element.prepend(panel.canvas)
		}
		for (const element of document.querySelectorAll<HTMLElement>(selector)) {
			if (panels.has(element) || !hasBlurClass(element)) continue
			// Blur belongs on containers, not replaced/void elements or form values.
			if (element.matches('input,textarea,select,option,img,canvas,video,audio,iframe,br,hr,link,meta')) continue
			element.dataset.gameBlurPanel = ''
			const canvas = document.createElement('canvas')
			canvas.dataset.gameBlurCanvas = ''
			canvas.setAttribute('aria-hidden', 'true')
			canvas.hidden = true
			const panel: Panel = {
				canvas,
				visible: false,
				failed: false,
				lost: false,
				background: '',
				color: new Float32Array(4),
				cleanup: () => {
					canvas.removeEventListener('webglcontextlost', onLost)
					canvas.removeEventListener('webglcontextrestored', onRestored)
					panel.renderer?.dispose()
					// The canvas is being discarded; release its context as well.
					if (panel.renderer) canvas.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext()
					canvas.remove()
				},
			}
			const onLost = (event: Event) => {
				event.preventDefault()
				panel.lost = true
				canvas.hidden = true
				panel.renderer?.dispose()
				panel.renderer = undefined
			}
			const onRestored = () => {
				panel.lost = false
				panel.failed = false
				schedule()
			}
			panels.set(element, panel)
			if (native) {
				canvas.addEventListener('webglcontextlost', onLost)
				canvas.addEventListener('webglcontextrestored', onRestored)
				element.prepend(canvas)
				intersection.observe(element)
			}
		}
		schedule()
	}
	const mutations = new MutationObserver(() => {
		if (queued || disposed) return
		queued = true
		queueMicrotask(sync)
	})
	mutations.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
	const visibilityChanged = () => {
		stop()
		schedule()
	}
	document.addEventListener('visibilitychange', visibilityChanged)
	sync()
	return () => {
		disposed = true
		stop()
		mutations.disconnect()
		intersection.disconnect()
		document.removeEventListener('visibilitychange', visibilityChanged)
		for (const [element, panel] of panels) remove(element, panel)
		delete document.documentElement.dataset.gameBlur
	}
}
