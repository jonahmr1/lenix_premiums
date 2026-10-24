import { createGameBlur, isFiveM } from './game-blur'

const selector = '[class*="blurred-"]'
const hasBlurClass = (element: Element) => [...element.classList].some(name => /(?:^|:)blurred-\d+$/.test(name))
type Panel = {
	canvas: HTMLCanvasElement
	visible: boolean
	failed: boolean
	lost: boolean
	styles: Map<string, string>
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
	const layer = document.createElement('div')
	layer.dataset.gameBlurLayer = ''
	layer.setAttribute('aria-hidden', 'true')
	if (native) document.body.prepend(layer)
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
				// The game texture must sit behind ALL page backgrounds, including ancestors.
				// Keeping it inside the panel would paint over their gradients and tints.
				if (!positionCanvas(element, panel, style)) {
					panel.canvas.hidden = true
					continue
				}
				panel.renderer ??= createGameBlur(panel.canvas)
				if (panel.canvas.hidden) panel.canvas.hidden = false
				panel.renderer.draw(strength)
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
		if (native && !layer.isConnected) document.body.prepend(layer)
		for (const [element, panel] of panels) {
			if (!element.isConnected || !hasBlurClass(element)) remove(element, panel)
			// Restore the layer if a page replaced body content.
			else if (native && panel.canvas.parentElement !== layer) layer.append(panel.canvas)
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
				styles: new Map(),
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
				layer.append(canvas)
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
		layer.remove()
		delete document.documentElement.dataset.gameBlur
	}
}

/** Follow the panel in viewport space while its game layer lives behind the UI. */
function positionCanvas(element: HTMLElement, panel: Panel, style: CSSStyleDeclaration) {
	const rect = element.getBoundingClientRect()
	if (!rect.width || !rect.height || !element.getClientRects().length) return false

	let opacity = Number(style.opacity)
	let top = Math.max(0, rect.top)
	let right = Math.min(window.innerWidth, rect.right)
	let bottom = Math.min(window.innerHeight, rect.bottom)
	let left = Math.max(0, rect.left)
	for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
		const parentStyle = getComputedStyle(ancestor)
		opacity *= Number(parentStyle.opacity)
		if (!opacity || parentStyle.display === 'none') return false
		const clipX = /^(hidden|clip|scroll|auto)$/.test(parentStyle.overflowX)
		const clipY = /^(hidden|clip|scroll|auto)$/.test(parentStyle.overflowY)
		if (!clipX && !clipY) continue
		const bounds = ancestor.getBoundingClientRect()
		if (clipX) {
			left = Math.max(left, bounds.left)
			right = Math.min(right, bounds.right)
		}
		if (clipY) {
			top = Math.max(top, bounds.top)
			bottom = Math.min(bottom, bounds.bottom)
		}
	}
	if (right <= left || bottom <= top) return false

	const target = panel.canvas.style
	// Avoid invalidating the compositor's layer when the panel has not moved.
	const set = (property: string, value: string) => {
		if (panel.styles.get(property) === value) return
		target.setProperty(property, value)
		panel.styles.set(property, value)
	}
	set('left', `${rect.left}px`)
	set('top', `${rect.top}px`)
	set('width', `${rect.width}px`)
	set('height', `${rect.height}px`)
	set('opacity', String(opacity))
	set('border-top-left-radius', style.borderTopLeftRadius)
	set('border-top-right-radius', style.borderTopRightRadius)
	set('border-bottom-right-radius', style.borderBottomRightRadius)
	set('border-bottom-left-radius', style.borderBottomLeftRadius)
	const clipping = [top - rect.top, rect.right - right, rect.bottom - bottom, left - rect.left]
	set(
		'clip-path',
		clipping.every(value => value === 0) ? 'none' : `inset(${clipping.map(value => `${value}px`).join(' ')})`,
	)
	return true
}
