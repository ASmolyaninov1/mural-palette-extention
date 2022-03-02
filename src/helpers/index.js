const fromRGBToHex = ([ r, g, b ]) => {
  return [r, g, b].reduce((acc, el) => {
    const hex = el.toString(16)
    if (hex.length === 1) {
      return acc + 0 + hex
    }
    return acc + hex
  }, '#')
}

const copyToClipboard = term => {
  if (!navigator.clipboard) return
  navigator.clipboard.writeText(term)
}

export * from './mocks'
export { fromRGBToHex, copyToClipboard }