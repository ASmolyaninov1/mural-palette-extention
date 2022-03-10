import React from 'react'

import './MiniPaletteList.css'

/*
  paletteList: ["#someHexColor", "#someHexColor", ...] !required
  selectedColor: #someHexColor,
  handleSelect: (#someHexColor) => void
 */

const MiniPaletteList = ({ paletteList, selectedColor, handleSelect }) => {
  const handleSelectColor = (color) => () => handleSelect && handleSelect(color)

  return (
    <div className={'mini-palette-list'}>
      {paletteList.map(color => {

        return (
          <div
            key={color}
            className={'mini-palette-list-item'}
            style={{ background: color }}
            data-selected={selectedColor === color}
            onClick={handleSelectColor(color)}
          />
        )
      })}
    </div>
  )
}

export default MiniPaletteList