import React, { useContext, useEffect, useMemo, useState } from 'react'
import { HexColorPicker } from "react-colorful"
import { useLocation, navigate } from '@reach/router'
import { useAlert } from 'react-alert'

import { copyToClipboard } from "helpers"
import { SavePalettePopover } from "components"
import { Icon } from 'elements'
import { useApi } from "hooks"
import { PaletteContext } from "contexts"

import './MakePaletteSection.css'

const MakePaletteSection = ({ id }) => {
  const [currentColorId, setCurrentColorId] = useState(0)
  const [editableColors, setEditableColors] = useState([{hex: '#000000', id: 0}])
  const [palette, setPalette] = useState(null)
  const location = useLocation()
  const alert = useAlert()
  const backUrl = location.state?.backUrl
  const { createPalette, getPalette, updatePalette } = useApi()
  const { cachedPalette, setCachedPalette } = useContext(PaletteContext)

  const sectionMode = id === 'unsaved' ? 'edit_unsaved' : !id ? 'make' : 'edit_saved'

  useEffect(() => {
    switch (sectionMode) {
      case 'edit_saved':
        getPalette(id).then(data => {
          const paletteData = data?.result
          handleSetColors(paletteData.colors || [])
          setPalette(paletteData)
        })
        break
      case 'edit_unsaved':
        handleSetColors(cachedPalette.colors)
        setPalette({ title: cachedPalette.title, colors: cachedPalette.colors })
        break
      default:
        setPalette({ title: '' })
    }
  }, [sectionMode])

  const currentHexColor = useMemo(() => (
    editableColors.find(color => color.id === currentColorId)?.hex
  ), [editableColors, currentColorId])

  const handleSetColors = (colors) => {
    const convertedColors = colors
      .reverse()
      .map((color, index) => ({ id: index, hex: color }))
      .reverse()
    setEditableColors(convertedColors)
  }

  const handleChangeColor = (hex) => {
    const newPalette = editableColors.map(color => ({
      ...color,
      hex: color.id === currentColorId ? hex : color.hex
    }))
    setEditableColors(newPalette)
  }
  const handleCreateColor = () => {
    const newColorId = editableColors[0].id + 1
    const newPalette = [{ id: newColorId, hex: '#000000' }, ...editableColors]

    setCurrentColorId(newColorId)
    setEditableColors(newPalette)
  }
  const handleSelectColor = (id) => () => {
    setCurrentColorId(id)
  }
  const handleDeleteColor = (e) => {
    e.target.className = 'make-palette-preview-delete-color-area'
    const colorId = e.dataTransfer.getData('colorId')
    const newPalette = editableColors.filter((color) => color.id !== +colorId)
    if (currentColorId === +colorId) {
      setCurrentColorId(newPalette[0].id)
    }
    setEditableColors(newPalette)
  }
  const handleSavePalette = (title, access) => {
    const hexPalette = editableColors.map(color => color.hex)
    switch (sectionMode) {
      case 'edit_saved':
        updatePalette(id, { colors: hexPalette, title, access }).then(() => {
          alert.show('Palette updated')
          navigate(backUrl || '/')
        })
        break
      case 'edit_unsaved':
        setCachedPalette({ title: palette?.title || '', colors: hexPalette })
        navigate(`/coloring/unsaved`)
        break
      case 'make':
        createPalette({ colors: hexPalette, title, access }).then(() => {
          alert.show('Palette created')
        })
        setEditableColors([{ hex: '#000000', id: 0 }])
        setCurrentColorId(0)
        break
    }
  }

  if (!palette) return 'Loading...'

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
        {sectionMode === 'edit_unsaved' ? (
          <span className={'save-palette-popover-trigger'} onClick={handleSavePalette}>Save changes</span>
        ) : (
          <SavePalettePopover
            handleSave={handleSavePalette}
            position={'left'}
            triggerText={sectionMode === 'make' ? 'save' : 'Save changes'}
            defaultValues={palette}
          />
        )}
      </div>
      <div className={'make-palette-preview-content'}>
        {editableColors.length < 8 && (
          <Icon name={'Plus'} onClick={handleCreateColor} className={'make-palette-preview-content-plus-icon'} />
        )}
        {editableColors.map(color => (
          <div
            key={color.id}
            data-selected={color.id === currentColorId}
            className={'make-palette-preview-content-color'}
            style={{ background: color.hex }}
            onClick={handleSelectColor(color.id)}
            onDragStart={e => {
              e.dataTransfer.setData('colorId', color.id)
            }}
            draggable={editableColors.length > 1}
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