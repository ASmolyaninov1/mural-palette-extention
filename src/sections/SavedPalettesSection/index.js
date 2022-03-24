import React, { useContext, useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { useAlert } from "react-alert"

import { useApi } from "hooks"
import { DeletePaletteModal, SavePaletteModal, MenuPopover } from "components"
import { Icon } from 'elements'
import { UserContext } from "contexts"

import './SavedPalettesSection.css'
import { userApi } from "../../api"

const SavedPalettesSection = () => {
  const [palettesList, setPalettesList] = useState([])
  const [deletePaletteModalOpen, setDeletePaletteModalOpen] = useState(false)
  const [editPaletteModalOpen, setEditPaletteModalOpen] = useState(false)
  const [paletteIdToDelete, setPaletteIdToDelete] = useState(null)
  const [paletteToEdit, setPaletteToEdit] = useState(null)
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

  const handleEditPalette = (title, access) => {
    if (!!paletteToEdit) {
      updatePalette(paletteToEdit?.objectId, { title, access }).then(res => {
        if (res?.result === 'success') {
          const newPalettesList = [...palettesList]
          const updatingPaletteIndex = palettesList.findIndex(palette => paletteToEdit?.objectId === palette.objectId)
          newPalettesList[updatingPaletteIndex] = {...newPalettesList[updatingPaletteIndex], title}

          setPalettesList(newPalettesList)
          setEditPaletteModalOpen(false)
          alert.show('Palette updated')
        }
      })
    }
  }

  const handleEditPaletteModalOpen = (palette) => (closePopover) => {
    setPaletteToEdit(palette)
    setEditPaletteModalOpen(true)
    closePopover()
  }
  const handleEditPaletteModalClose = () => {
    setPaletteToEdit(null)
    setEditPaletteModalOpen(false)
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
        open={editPaletteModalOpen}
        onClose={handleEditPaletteModalClose}
        onCancel={handleEditPaletteModalClose}
        onComplete={handleEditPalette}
        defaultValues={paletteToEdit}
      />
      {palettesList.length === 0 && (
        <div>There are no saved palettes...</div>
      )}
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
                  { title: 'Edit palette', onClick: handleEditPaletteModalOpen(palette) },
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