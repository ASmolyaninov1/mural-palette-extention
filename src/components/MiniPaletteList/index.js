import React from 'react'
import './MiniPaletteList.css'

const fromRGBToHex = ([ r, g, b ]) => {
  return [r, g, b].reduce((acc, el) => {
    const hex = el.toString(16)
    if (hex.length === 1) {
      return acc + 0 + hex
    }
    return acc + hex
  }, '#')
}

const MiniPaletteList = ({ paletteList, selectedColor, handleSelect }) => {
  const handleSelectColor = (color) => handleSelect(color)

  return (
    <div className={'mini-palette-list'}>
      {paletteList.map(color => {
        const hexColor = fromRGBToHex(color)

        return (
          <div
            key={hexColor}
            className={'mini-palette-list-item'}
            style={{ background: hexColor }}
            data-selected={selectedColor === hexColor}
            onClick={handleSelectColor(hexColor)}
          />
        )
      })}
    </div>
  )
}

export default MiniPaletteList