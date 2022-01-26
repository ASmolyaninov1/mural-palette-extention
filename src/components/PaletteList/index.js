import React from 'react'
import { CopyIcon } from "../../icons"

import './PaletteList.css'

const fromRGBToHex = ([ r, g, b ]) => {
  return [r, g, b].reduce((acc, el) => {
    const hex = el.toString(16)
    if (hex.length === 1) {
      return acc + 0 + hex
    }
    return acc + hex
  }, '#')
}

const PaletteList = ({ paletteList, handleSelect, selectedColor }) => {
  const handleSelectColor = (color) => handleSelect(color)
  const handleCopyToClipboard = color => () => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(color)
  }

  return (
    <ul className={'palette-list'}>
      {paletteList.map(color => {
        const hexColor = fromRGBToHex(color)

        return (
          <li className={'palette-list-item'} key={hexColor}>
            <div
              className={'palette-list-item-color'}
              style={{ backgroundColor: hexColor }}
              data-selected={hexColor === selectedColor}
              onClick={handleSelectColor(hexColor)}
            />
            <div className={'palette-list-item-info'}>
              <div>{hexColor}</div>
              <CopyIcon onClick={handleCopyToClipboard(hexColor.toUpperCase())} />
            </div>
          </li>
        )
      })}
      <div className={'palette-list-hint'}>
        Select item to change color.
      </div>
    </ul>
  )
}

export default PaletteList