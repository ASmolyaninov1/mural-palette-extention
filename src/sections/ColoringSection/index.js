import React, { useEffect, useState, useContext } from 'react'
import { useLocation, navigate } from '@reach/router'
import { useAlert } from 'react-alert'
import { ArrowIcon, PlusIcon } from "icons"
import { MenuPopover, MiniPaletteList, Icon, DeletePaletteModal, SavePaletteModal } from "components"
import { useApi } from 'hooks'
import PaletteContext from 'PaletteContext'

import './ColoringSection.css'

const ColoringSection = ({ id }) => {
  const [selectedColor, setSelectedColor] = useState(null)
  const [deletePaletteModalOpen, setDeletePaletteModalOpen] = useState(false)
  const [savePaletteModalOpen, setSavePaletteModalOpen] = useState(false)
  const [palette, setPalette] = useState(null)
  const location = useLocation()
  const alert = useAlert()
  const { getPalette, deletePalette, updatePalette, createPalette } = useApi()
  const { cachedPalette, setCachedPalette } = useContext(PaletteContext)

  const isUnsavedPalette = id === 'unsaved'
  const backUrl = location.state?.backUrl

  useEffect(() => {
    if (isUnsavedPalette) {
      setPalette(cachedPalette)
    } else {
      getPalette(id).then(res => {
        if (!res.result) navigate(backUrl || '/')
        setPalette(res.result)
      })
    }
  }, [])

  useEffect(() => {
    if (palette) {
      const color = location.state?.color
      if (color) {
        setSelectedColor(color)
      } else {
        setSelectedColor(palette.colors[0])
      }
    }
  }, [palette])

  const handleDeletePalette = () => {
    deletePalette(palette.objectId).then((res) => {
      if (res?.result === 'success') {
        setDeletePaletteModalOpen(false)
        alert.show('Palette deleted')
        navigate(backUrl || '/')
      }
    })
  }

  const handleSavePalette = (title) => {
    if (isUnsavedPalette) {
      createPalette({ title, colors: palette.colors }).then(res => {
        if (res?.result?.objectId) {
          setCachedPalette({})
          setSavePaletteModalOpen(false)
          alert.show('Palette saved')
          setPalette(res.result)
          navigate(`/coloring/${res.result.objectId}`)
        }
      })
    } else {
      updatePalette(palette.objectId, { title }).then(res => {
        if (res?.result === 'success') {
          setPalette({
            ...palette,
            title
          })
          setSavePaletteModalOpen(false)
          alert.show('Palette updated')
        }
      })
    }
  }

  const handleSavePaletteModalOpen = (closePopover) => {
    setSavePaletteModalOpen(true)
    closePopover()
  }
  const handleSavePaletteModalClose = () => {
    setSavePaletteModalOpen(false)
  }

  const handleDeletePaletteModalOpen = (closePopover) => {
    setDeletePaletteModalOpen(true)
    closePopover()
  }
  const handleDeletePaletteModalClose = () => {
    setDeletePaletteModalOpen(false)
  }

  const handleEditColors = () => {
    if (isUnsavedPalette) {
      navigate(`/make-palette/unsaved`)
    } else {
      navigate(`/make-palette/${palette.objectId}`)
    }
  }

  const renderMenuPopover = () => {
    const savedPaletteMenu = [
      { title: 'Edit palette', onClick: handleSavePaletteModalOpen },
      { title: 'Edit colors', onClick: handleEditColors },
      { title: 'Delete palette', onClick: handleDeletePaletteModalOpen },
    ]
    const notSavedPaletteMenu = [
      { title: 'Save palette', onClick: handleSavePaletteModalOpen },
      { title: 'Edit colors', onClick: handleEditColors },
    ]

    return (
      <MenuPopover
        position={'left'}
        trigger={<Icon name={'Dots'} />}
        menu={isUnsavedPalette ? notSavedPaletteMenu : savedPaletteMenu}
      />
    )
  }

  const handlePaintWidgetBorder = async () => {
    const selectedWidgetsList = await window.muralSdk.selectionSdk.list()
    if (selectedWidgetsList.length) {
      selectedWidgetsList.forEach(selectedWidget => {
        window.muralSdk.widgets.set.border.style(selectedWidget.id, 'solid')
        window.muralSdk.widgets.set.border.color(selectedWidget.id, selectedColor)
      })
    }
  }
  const handlePaintWidgetBackground = async () => {
    const selectedWidgetsList = await window.muralSdk.selectionSdk.list()
    if (selectedWidgetsList.length) {
      selectedWidgetsList.forEach(selectedWidget => {
        window.muralSdk.widgets.set.background.color(selectedWidget.id, selectedColor)
      })
    }
  }

  if (!palette) return 'Loading...'

  return (
    <div>
      <DeletePaletteModal
        open={deletePaletteModalOpen}
        onClose={handleDeletePaletteModalClose}
        onCancel={handleDeletePaletteModalClose}
        onDelete={handleDeletePalette}
      />
      <SavePaletteModal
        open={savePaletteModalOpen}
        onClose={handleSavePaletteModalClose}
        onCancel={handleSavePaletteModalClose}
        onComplete={handleSavePalette}
        title={palette?.title || ''}
      />
      <div className={'coloring-section-back'} onClick={() => navigate(backUrl || '/')}>
        <ArrowIcon />
        <div>Back</div>
      </div>
      <div className={'coloring-section-title'}>{palette.title || ''}</div>
      <div className={'coloring-section-colors-list'}>
        <MiniPaletteList
          paletteList={palette.colors || []}
          handleSelect={setSelectedColor}
          selectedColor={selectedColor}
        />
        {renderMenuPopover()}
      </div>
      <div className={'coloring-section-type-list'}>
        <div className={'coloring-section-type'}>
          <div>Fill</div>
          <div className={'coloring-section-type-icon'} onClick={handlePaintWidgetBackground}>
            <PlusIcon />
          </div>
        </div>
        <div className={'coloring-section-type'}>
          <div>Border</div>
          <div className={'coloring-section-type-icon'} onClick={handlePaintWidgetBorder}>
            <PlusIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColoringSection