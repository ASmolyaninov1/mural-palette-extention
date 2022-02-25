import React from 'react'
import { CopyIcon } from "icons"
import { fromRGBToHex } from "helpers"

import './PaletteList.css'

const PaletteList = ({ paletteList, handleSelect, selectedColor }) => {
  const handleSelectColor = (color) => handleSelect(color)
  const handleCopyToClipboard = color => () => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(color)
  }

  if (!paletteList.length) return null

  return (
    <>
      <div className={'palette-list-hint'}>
        Select item to change color
      </div>
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
      </ul>
    </>
  )
}

export default PaletteList