import React, { useEffect, useMemo, useState } from 'react'
import { HexColorPicker } from "react-colorful"
import { useLocation, navigate } from '@reach/router'
import { useAlert } from 'react-alert'

import { copyToClipboard } from "helpers"
import { SavePalettePopover, Icon } from "components"
import { useApi } from "hooks"

import './MakePaletteSection.css'

const MakePaletteSection = () => {
  const [currentColorId, setCurrentColorId] = useState(0)
  const [palette, setPalette] = useState([{hex: '#000000', id: 0}])
  const [paletteTitle, setPaletteTitle] = useState('')
  const location = useLocation()
  const alert = useAlert()
  const paletteId = location.state?.paletteId
  const colors = location.state?.colors
  const title = location.state?.title
  const backUrl = location.state?.backUrl
  const { createPalette, getPalette, updatePalette } = useApi()

  const sectionMode = !!paletteId ? 'edit_saved' : !!colors ? 'edit_unsaved' : 'make'

  useEffect(() => {
    if (sectionMode === 'edit_saved') {
      getPalette(paletteId).then(data => {
        const paletteData = data?.result
        handleSetColors(paletteData.colors || [])
        setPaletteTitle(paletteData.title)
      })
    }
    if (sectionMode === 'edit_unsaved') {
      handleSetColors(colors)
      setPaletteTitle(title)
    }
  }, [sectionMode])

  const currentHexColor = useMemo(() => palette.find(color => color.id === currentColorId)?.hex, [palette, currentColorId])

  const handleSetColors = (colors) => {
    const convertedColors = colors
      .reverse()
      .map((color, index) => ({ id: index, hex: color }))
      .reverse()
    setPalette(convertedColors)
  }

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
  const handleSavePalette = (title) => {
    const hexPalette = palette.map(color => color.hex)
    switch (sectionMode) {
      case 'edit_saved':
        updatePalette(paletteId, { colors: hexPalette, title }).then(() => {
          alert.show('Palette updated')
          navigate(backUrl || '/')
        })
        break
      case 'edit_unsaved':
        createPalette({ colors: hexPalette, title }).then(() => {
          alert.show('Palette created')
        })
        setPalette([{ hex: '#000000', id: 0 }])
        setCurrentColorId(0)
        break
      case 'make':
        navigate(
          '/coloring',
          {
            state: {
              palette: { title, colors: hexPalette }
            }
          }
        )
        break
    }
  }

  return (
    <div className={'make-palette'}>
      <div className={'make-palette-color-picker-wrapper'}>
        <HexColorPicker color={currentHexColor} onChange={handleChangeColor} />
        <div className={'make-palette-color-picker-info'}>
          <div>{currentHexColor.toUpperCase()}</div>
          <Icon name={'Copy'} onClick={() => copyToClipboard(currentHexColor)} />
        </div>
      </div>
      <div className={'make-palette-preview-header'}>
        <div className={'make-palette-preview-header-title'}>Your new palette</div>
        <SavePalettePopover
          handleSave={handleSavePalette}
          position={'left'}
          triggerText={sectionMode === 'make' ? 'save' : 'Save changes'}
          defaultTitle={paletteTitle}
        />
      </div>
      <div className={'make-palette-preview-content'}>
        {palette.length < 8 && (
          <Icon name={'Plus'} onClick={handleCreateColor} className={'make-palette-preview-content-plus-icon'} />
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