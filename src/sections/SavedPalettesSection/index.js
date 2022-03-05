import React, { useEffect, useState } from 'react'
import { useApi } from "hooks"
import { Popover, DeletePaletteModal, RenamePaletteModal, Icon } from "components"

import './SavedPalettesSection.css'

const SavedPalettesSection = ({ handleChangeSection }) => {
  const [palettesList, setPalettesList] = useState([])
  const [deletePaletteModalOpen, setDeletePaletteModalOpen] = useState(false)
  const [renamePaletteModalOpen, setRenamePaletteModalOpen] = useState(false)
  const [paletteIdToDelete, setPaletteIdToDelete] = useState(null)
  const [paletteIdToRename, setPaletteIdToRename] = useState(null)
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
      }
    })
  }

  const handleRenamePalette = (title) => {
    updatePalette(paletteIdToRename, { title }).then(res => {
      if (res?.result === 'success') {
        const newPalettesList = [...palettesList]
        const updatingPaletteIndex = palettesList.findIndex(palette => paletteIdToRename === palette.objectId)
        newPalettesList[updatingPaletteIndex] = {...newPalettesList[updatingPaletteIndex], title}

        setPalettesList(newPalettesList)
        setRenamePaletteModalOpen(false)
      }
    })
  }

  const handleRenamePaletteModalOpen = (id, closePopover) => () => {
    setPaletteIdToRename(id)
    setRenamePaletteModalOpen(true)
    closePopover()
  }
  const handleRenamePaletteModalClose = () => {
    setPaletteIdToRename(null)
    setRenamePaletteModalOpen(false)
  }

  const handleDeletePaletteModalOpen = (id, close) => () => {
    setPaletteIdToDelete(id)
    setDeletePaletteModalOpen(true)
    close()
  }
  const handleDeletePaletteModalClose = () => {
    setDeletePaletteModalOpen(false)
    setPaletteIdToDelete(null)
  }

  return (
    <div>
      <DeletePaletteModal
        open={deletePaletteModalOpen}
        onClose={handleDeletePaletteModalClose}
        onCancel={handleDeletePaletteModalClose}
        onDelete={handleDeletePalette}
      />
      <RenamePaletteModal
        open={renamePaletteModalOpen}
        onClose={handleRenamePaletteModalClose}
        onCancel={handleRenamePaletteModalClose}
        onComplete={handleRenamePalette}
      />
      {palettesList.map((palette, index) => {
        return (
          <div
            key={index}
            className={'saved-palettes-palette'}
            onClick={() => handleChangeSection('get-palette', { selectedPalette: palette.colors })}
          >
            <div className={'saved-palettes-palette-title'}>{palette.title}</div>
            <div className={'saved-palettes-palette-content'}>
              {palette.colors.map(color => {
                return (
                  <div
                    key={color}
                    className={'saved-palettes-palette-content-color'}
                    style={{ background: color }}
                  />
                )
              })}
              <Popover position={'left'} trigger={<Icon name={'Dots'} />}>
                {close => (
                  <div className={'saved-palettes-palette-content-popover-menu'}>
                    <div
                      className={'saved-palettes-palette-content-popover-menu-item'}
                      onClick={handleRenamePaletteModalOpen(palette.objectId, close)}
                    >
                      Rename palette
                    </div>
                    <div
                      className={'saved-palettes-palette-content-popover-menu-item'}
                      onClick={handleDeletePaletteModalOpen(palette.objectId, close)}
                    >
                      Delete palette
                    </div>
                  </div>
                )}
              </Popover>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SavedPalettesSection