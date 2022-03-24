import React, { useEffect, useState, useContext } from 'react'
import { useLocation, navigate } from '@reach/router'
import { useAlert } from 'react-alert'
import { ArrowIcon } from 'icons'
import {
  MenuPopover,
  MiniPaletteList,
  DeletePaletteModal,
  SavePaletteModal,
  PaletteAccessRadio
} from "components"
import { Icon, Popover, Checkbox } from 'elements'
import { useApi } from 'hooks'
import { copyToClipboard, capitalize } from 'helpers'
import { PaletteContext } from 'contexts'

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
    setPalette(null)
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
        setSelectedColor(palette?.colors[0])
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

  const handleSavePalette = (title, access) => {
    console.log(' === check === ')
    if (isUnsavedPalette) {
      createPalette({ title, colors: palette.colors, access }).then(res => {
        if (res?.result?.objectId) {
          setCachedPalette({})
          setSavePaletteModalOpen(false)
          alert.show('Palette saved')
          setPalette(res.result)
          navigate(`/coloring/${res.result.objectId}`)
        }
      })
    } else {
      updatePalette(palette.objectId, { title, access }).then(res => {
        if (res?.result === 'success') {
          setPalette({
            ...palette,
            access,
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
      navigate(`/make-palette/unsaved`, { state: { backUrl: '/coloring/unsaved' } })
    } else {
      navigate(`/make-palette/${palette.objectId}`, { state: { backUrl: `/coloring/${palette.objectId}` } })
    }
  }

  const handleSetAsDefaultPalette = (isDefault) => {
    setPalette({ ...palette, isDefault })
    updatePalette(palette.objectId, { isDefault }).then(res => {
      if (res?.result === 'success') {
        alert.show('Palette updated')
      }
    })
  }

  const handleUpdateAccess = (access, closePopover) => {
    setPalette({ ...palette, access })
    updatePalette(palette.objectId, { access }).then(res => {
      if (res?.result === 'success') {
        alert.show('Palette updated')
      }
      closePopover()
    })
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
        defaultValues={palette}
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
      <div className={'coloring-section-actions-list'}>
        <div className={'coloring-section-title'}>Available actions</div>
        <div className={'coloring-section-action'}>
          <div>{selectedColor}</div>
          <Icon name={'Copy'} onClick={() => copyToClipboard(selectedColor)} />
        </div>
        <div className={'coloring-section-action'}>
          <div>Fill</div>
          <Icon name={'Plus'} onClick={handlePaintWidgetBackground} />
        </div>
        <div className={'coloring-section-action'}>
          <div>Border</div>
          <Icon name={'Plus'} onClick={handlePaintWidgetBorder} />
        </div>
      </div>
      {!isUnsavedPalette && (
        <>
          <div className={'coloring-section-actions-list'}>
            <div className={'coloring-section-title'}>State of palette</div>
            <div className={'coloring-section-action'}>
              <div>Set as default</div>
              <Checkbox defaultValue={palette.isDefault} onChange={handleSetAsDefaultPalette} />
            </div>
          </div>
          <div className={'coloring-section-actions-list'}>
            <div className={'coloring-section-title'}>Access to palette</div>
            <div className={'coloring-section-action-access'}>
              Who can use this palette?{' '}
              <Popover trigger={<span className={'coloring-section-action-access-btn'}>{capitalize(palette.access)}</span>}>
                {(close) => <PaletteAccessRadio access={palette.access} onChange={(access) => handleUpdateAccess(access, close)} />}
              </Popover>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ColoringSection