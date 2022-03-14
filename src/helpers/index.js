export const fromRGBToHex = ([ r, g, b ]) => {
  return [r, g, b].reduce((acc, el) => {
    const hex = el.toString(16)
    if (hex.length === 1) {
      return acc + 0 + hex
    }
    return acc + hex
  }, '#')
}

export const copyToClipboard = term => {
  if (!navigator.clipboard) return
  navigator.clipboard.writeText(term)
}

export const capitalize = term => {
  if (!term) return ''
  return term[0].toUpperCase() + term.slice(1)
}

export const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export * from './mocks'