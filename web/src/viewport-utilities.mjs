import plugin from 'tailwindcss/plugin'

// -w-N: Nvw; -h-N: Nvh. -v-N uses an axis pair where meaningful,
// and the average of Nvh/Nvw for properties that take a single length.
export default plugin(({ matchUtilities }) => {
  const utilities = new Map()
  const add = (name, properties, negative = false, pair) => {
    utilities.set(name, { properties: properties.split(' '), negative, pair })
  }

  for (const [name, property] of Object.entries({ w: 'width', h: 'height', inline: 'inline-size', block: 'block-size' })) {
    add(name, property)
    add(`min-${name}`, `min-${property}`)
    add(`max-${name}`, `max-${property}`)
  }
  add('size', 'width height', false, (vh, vw) => ({ width: vw, height: vh }))

  for (const [prefix, property] of Object.entries({ p: 'padding', m: 'margin' })) {
    const negative = prefix === 'm'
    add(prefix, property, negative, (vh, vw) => ({ [property]: `${vh} ${vw}` }))
    for (const [suffix, sides] of Object.entries({
      x: ['left', 'right'], y: ['top', 'bottom'],
      t: ['top'], r: ['right'], b: ['bottom'], l: ['left'],
      s: ['inline-start'], e: ['inline-end'],
      bs: ['block-start'], be: ['block-end'],
    })) {
      add(`${prefix}${suffix}`, sides.map(side => `${property}-${side}`).join(' '), negative)
    }
  }

  add('gap', 'gap', false, (vh, vw) => ({ 'row-gap': vh, 'column-gap': vw }))
  add('gap-x', 'column-gap')
  add('gap-y', 'row-gap')
  add('space-x', '', true)
  add('space-y', '', true)
  add('inset', 'inset', true, (vh, vw) => ({ inset: `${vh} ${vw}` }))
  add('inset-x', 'left right', true)
  add('inset-y', 'top bottom', true)
  for (const side of ['top', 'right', 'bottom', 'left']) add(side, side, true)
  for (const [name, property] of Object.entries({
    'inset-s': 'inset-inline-start', 'inset-e': 'inset-inline-end',
    'inset-bs': 'inset-block-start', 'inset-be': 'inset-block-end',
  })) add(name, property, true)

  for (const [name, property] of Object.entries({
    text: 'font-size', leading: 'line-height', basis: 'flex-basis',
    columns: 'column-width', perspective: 'perspective',
    'decoration': 'text-decoration-thickness', outline: 'outline-width',
    'auto-cols': 'grid-auto-columns', 'auto-rows': 'grid-auto-rows',
    'grid-cols': 'grid-template-columns', 'grid-rows': 'grid-template-rows',
    stroke: 'stroke-width',
  })) add(name, property)
  for (const [name, property] of Object.entries({
    tracking: 'letter-spacing', 'word-spacing': 'word-spacing',
    indent: 'text-indent', 'outline-offset': 'outline-offset',
    'underline-offset': 'text-underline-offset',
  })) add(name, property, true)

  add('border', 'border-width', false, (vh, vw) => ({ 'border-width': `${vh} ${vw}` }))
  for (const [suffix, sides] of Object.entries({
    x: ['left', 'right'], y: ['top', 'bottom'], t: ['top'],
    r: ['right'], b: ['bottom'], l: ['left'], s: ['inline-start'], e: ['inline-end'],
  })) add(`border-${suffix}`, sides.map(side => `border-${side}-width`).join(' '))

  // Radius uses horizontal / vertical radii, not padding's top/right syntax.
  add('rounded', 'border-radius', false, (vh, vw) => ({ 'border-radius': `${vw} / ${vh}` }))
  for (const [suffix, corners] of Object.entries({
    t: ['top-left', 'top-right'], r: ['top-right', 'bottom-right'],
    b: ['bottom-left', 'bottom-right'], l: ['top-left', 'bottom-left'],
    tl: ['top-left'], tr: ['top-right'], bl: ['bottom-left'], br: ['bottom-right'],
    ss: ['start-start'], se: ['start-end'], es: ['end-start'], ee: ['end-end'],
  })) {
    const properties = corners.map(corner => `border-${corner}-radius`)
    add(`rounded-${suffix}`, properties.join(' '), false,
      (vh, vw) => Object.fromEntries(properties.map(property => [property, `${vw} ${vh}`])))
  }

  for (const [name, { properties, negative, pair }] of utilities) {
    for (const unit of ['w', 'h', 'v']) {
      matchUtilities({
        [`${name}-${unit}`]: value => {
          const vh = `calc(${value} * 1vh)`
          const vw = `calc(${value} * 1vw)`
          if (unit === 'v' && pair) return pair(vh, vw)
          const length = unit === 'w' ? vw : unit === 'h' ? vh
            : `calc(${value} * (1vh + 1vw) / 2)`
          if (name === 'space-x' || name === 'space-y') {
            const axis = name === 'space-x' ? 'inline' : 'block'
            const reverse = `--tw-${name}-reverse`
            return {
              ':where(& > :not(:last-child))': {
                [reverse]: '0',
                [`margin-${axis}-start`]: `calc(${length} * var(${reverse}))`,
                [`margin-${axis}-end`]: `calc(${length} * calc(1 - var(${reverse})))`,
              },
            }
          }
          return Object.fromEntries(properties.map(property => [property, length]))
        },
      }, {
        type: 'number',
        supportsNegativeValues: negative,
        values: {
          __BARE_VALUE__: ({ value }) => /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ? value : undefined,
        },
      })
    }
  }
})
