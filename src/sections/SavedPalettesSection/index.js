import React, { useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { useAlert } from "react-alert"

import { useApi } from "hooks"
import { DeletePaletteModal, SavePaletteModal, Icon, MenuPopover } from "components"

import './SavedPalettesSection.css'

const SavedPalettesSection = () => {
  const [palettesList, setPalettesList] = useState([])
  const [deletePaletteModalOpen, setDeletePaletteModalOpen] = useState(false)
  const [renamePaletteModalOpen, setRenamePaletteModalOpen] = useState(false)
  const [paletteIdToDelete, setPaletteIdToDelete] = useState(null)
  const [paletteToRename, setPaletteToRename] = useState(null)
  const alert = useAlert()
  const { loading, getAllPalettes, deletePalette, updatePalette } = useApi()

  useEffect(() => {
    fetchPalettesList()
  }, [])

  const fetchPalettesList = () => {
    getAllPalettes().then(res => {
      if (res?.result) {
        setPalettesList(res.result)
      }
    })
  }

  const handleDeletePalette = () => {
    deletePalette(paletteIdToDelete).then((res) => {
      if (res?.result === 'success') {
        const newPalettesList = palettesList.filter(palette => paletteIdToDelete !== palette.objectId)
        setPalettesList(newPalettesList)
        setDeletePaletteModalOpen(false)
        alert.show('Palette deleted')
      }
    })
  }

  const handleRenamePalette = (title) => {
    if (!!paletteToRename) {
      updatePalette(paletteToRename?.objectId, { title }).then(res => {
        if (res?.result === 'success') {
          const newPalettesList = [...palettesList]
          const updatingPaletteIndex = palettesList.findIndex(palette => paletteToRename?.objectId === palette.objectId)
          newPalettesList[updatingPaletteIndex] = {...newPalettesList[updatingPaletteIndex], title}

          setPalettesList(newPalettesList)
          setRenamePaletteModalOpen(false)
          alert.show('Palette updated')
        }
      })
    }
  }

  const handleRenamePaletteModalOpen = (palette) => (closePopover) => {
    setPaletteToRename(palette)
    setRenamePaletteModalOpen(true)
    closePopover()
  }
  const handleRenamePaletteModalClose = () => {
    setPaletteToRename(null)
    setRenamePaletteModalOpen(false)
  }

  const handleDeletePaletteModalOpen = (id) => (closePopover) => {
    setPaletteIdToDelete(id)
    setDeletePaletteModalOpen(true)
    closePopover()
  }
  const handleDeletePaletteModalClose = () => {
    setDeletePaletteModalOpen(false)
    setPaletteIdToDelete(null)
  }
  const handleEditColors = (palette) => () => {
    navigate(`make-palette/${palette.objectId}`, { state: { backUrl: '/saved' } })
  }

  return (
    <div>
      <DeletePaletteModal
        open={deletePaletteModalOpen}
        onClose={handleDeletePaletteModalClose}
        onCancel={handleDeletePaletteModalClose}
        onDelete={handleDeletePalette}
      />
      <SavePaletteModal
        open={renamePaletteModalOpen}
        onClose={handleRenamePaletteModalClose}
        onCancel={handleRenamePaletteModalClose}
        onComplete={handleRenamePalette}
        title={paletteToRename?.title || ''}
      />
      {palettesList.map((palette, index) => {
        return (
          <div
            key={index}
            className={'saved-palettes-palette'}
            onClick={() => {
              navigate(`coloring/${palette.objectId}`, {state: { backUrl: '/saved' }})
            }}
          >
            <div className={'saved-palettes-palette-title'}>{palette.title}</div>
            <div className={'saved-palettes-palette-content'}>
              {palette.colors.map(color => {
                return (
                  <div
                    key={color + Math.random()}
                    className={'saved-palettes-palette-content-color'}
                    style={{ background: color }}
                  />
                )
              })}
              <MenuPopover
                position={'left'}
                trigger={<Icon name={'Dots'} />}
                menu={[
                  { title: 'Edit palette', onClick: handleRenamePaletteModalOpen(palette) },
                  { title: 'Edit colors', onClick: handleEditColors(palette) },
                  { title: 'Delete palette', onClick: handleDeletePaletteModalOpen(palette.objectId) },
                ]}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SavedPalettesSection