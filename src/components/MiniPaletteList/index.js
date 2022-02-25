import React from 'react'
import { fromRGBToHex } from "helpers"

import './MiniPaletteList.css'

/*
  paletteList: [[r, g, b], [r, g, b], ...] !required
  selectedColor: #someHexColor,
  handleSelect: (#someHexColor) => void
 */

const MiniPaletteList = ({ paletteList, selectedColor, handleSelect }) => {
  const handleSelectColor = (color) => handleSelect && handleSelect(color)

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