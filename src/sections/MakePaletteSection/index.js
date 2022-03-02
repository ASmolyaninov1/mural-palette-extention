import React, { useMemo, useState } from 'react'
import { HexColorPicker } from "react-colorful"

import { copyToClipboard } from "helpers"
import { CopyIcon, PlusIcon } from 'icons'
import { SavePalettePopover } from "components"
import { useApi } from "hooks"

import './MakePaletteSection.css'

const MakePaletteSection = () => {
  const [currentColorId, setCurrentColorId] = useState(0)
  const [palette, setPalette] = useState([{hex: '#000000', id: 0}])
  const { createPalette } = useApi()

  const currentHexColor = useMemo(() => palette.find(color => color.id === currentColorId)?.hex, [palette, currentColorId])

  const handleChangeColor = (hex) => {
    const newPalette = palette.map(color => ({
      ...color,
      hex: color.id === currentColorId ? hex : color.hex
    }))
    setPalette(newPalette)
  }
  const handleCreateColor = () => {
    const newColorId = palette[0].id + 1
    const newPalette = [{ id: newColorId, hex: '#000000' }, ...palette]

    setCurrentColorId(newColorId)
    setPalette(newPalette)
  }
  const handleSelectColor = (id) => () => {
    setCurrentColorId(id)
  }
  const handleDeleteColor = (e) => {
    e.target.className = 'make-palette-preview-delete-color-area'
    const colorId = e.dataTransfer.getData('colorId')
    const newPalette = palette.filter((color) => color.id !== +colorId)
    if (currentColorId === +colorId) {
      setCurrentColorId(newPalette[0].id)
    }
    setPalette(newPalette)
  }
  const handleCreatePalette = (title) => {
    const hexPalette = palette.map(color => color.hex)
    createPalette({ colors: hexPalette, title })
    setPalette([{ hex: '#000000', id: 0 }])
    setCurrentColorId(0)
  }

  return (
    <div className={'make-palette'}>
      <div className={'make-palette-color-picker-wrapper'}>
        <HexColorPicker color={currentHexColor} onChange={handleChangeColor} />
        <div className={'make-palette-color-picker-info'}>
          <div>{currentHexColor.toUpperCase()}</div>
          <div className={'make-palette-color-picker-info-copy-icon'} onClick={() => copyToClipboard(currentHexColor)}>
            <CopyIcon />
          </div>
        </div>
      </div>
      <div className={'make-palette-preview-header'}>
        <div className={'make-palette-preview-header-title'}>Your new palette</div>
        <SavePalettePopover handleSave={handleCreatePalette} position={'left'} />
      </div>
      <div className={'make-palette-preview-content'}>
        {palette.length < 8 && (
          <div className={'make-palette-preview-content-plus-icon'} onClick={handleCreateColor}>
            <PlusIcon />
          </div>
        )}
        {palette.map(color => (
          <div
            key={color.id}
            data-selected={color.id === currentColorId}
            className={'make-palette-preview-content-color'}
            style={{ background: color.hex }}
            onClick={handleSelectColor(color.id)}
            onDragStart={e => {
              e.dataTransfer.setData('colorId', color.id)
            }}
            draggable={palette.length > 1}
          />
        ))}
      </div>
      <div
        className={'make-palette-preview-delete-color-area'}
        onDragOver={e => {
          e.preventDefault()
          const isActiveClassName = e.target.className.includes('make-palette-preview-delete-color-area__active')
          if (!isActiveClassName) {
            e.target.className += ' make-palette-preview-delete-color-area__active'
          }
        }}
        onDrop={handleDeleteColor}
        onDragLeave={e => {
          e.target.className = 'make-palette-preview-delete-color-area'
        }}
      >
        Drag color here to delete it
      </div>
    </div>
  )
}

export default MakePaletteSection