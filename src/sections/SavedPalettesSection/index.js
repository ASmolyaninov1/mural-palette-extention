import React, { useContext, useEffect, useMemo, useState } from 'react'
import { navigate } from '@reach/router'
import { useAlert } from "react-alert"

import { useApi } from "hooks"
import { DeletePaletteModal, SavePaletteModal, MenuPopover, Collapse } from "components"
import { Icon } from 'elements'
import { UserContext } from "contexts"

import './SavedPalettesSection.css'

const SavedPalettesSection = () => {
  const [palettesList, setPalettesList] = useState([])
  const [deletePaletteModalOpen, setDeletePaletteModalOpen] = useState(false)
  const [editPaletteModalOpen, setEditPaletteModalOpen] = useState(false)
  const [paletteIdToDelete, setPaletteIdToDelete] = useState(null)
  const [paletteToEdit, setPaletteToEdit] = useState(null)
  const alert = useAlert()
  const { loading, getAllPalettes, deletePalette, updatePalette, updatePaletteAsDefault, updateFavouritePalettes } = useApi()
  const { user } = useContext(UserContext)

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
  const handleToggleDefaultPalette = (id) => () => {
    updatePaletteAsDefault(id).then(res => {
      if (res?.result === 'success') {
        alert.show('Palette updated')
      }
    })
  }
  const handleToggleFavouritePalette = (id) => () => {
    updateFavouritePalettes(id).then(res => {
      if (res?.result === 'success') {
        alert.show('Palette updated')
      }
    })
  }

  console.log('user => ', user)

  const renderMenuPopover = (palette) => {
    const isDefaultPalette = palette.objectId === user.defaultPaletteId
    const isFavouritePalette = (user.favouritePalettesIds || []).includes(palette.objectId)
    const isCurrentUsersPalette = palette.muralUsername === user.muralUsername
    if (!isCurrentUsersPalette) return null

    let menu = [
      {
        title: isDefaultPalette ? 'Stop using as default' : 'Set as default',
        onClick: handleToggleDefaultPalette(palette.objectId)
      },
      {
        title: isFavouritePalette ? 'Delete from favourites' : 'Add to favourites',
        onClick: handleToggleFavouritePalette(palette.objectId)
      },
      { title: 'Edit palette', onClick: handleEditPaletteModalOpen(palette) },
      { title: 'Edit colors', onClick: handleEditColors(palette) },
      { title: 'Delete palette', onClick: handleDeletePaletteModalOpen(palette.objectId) },
    ]

    return (
      <MenuPopover
        position={'left'}
        trigger={<Icon name={'Dots'} />}
        menu={menu}
      />
    )
  }

  const renderPalette = (palette) => {
    return (
      <div
        key={palette.objectId}
        className={'saved-palettes-palette'}
        onClick={() => {
          navigate(`coloring/${palette.objectId}`, { state: { backUrl: '/saved' }})
        }}
      >
        <div className={'saved-palettes-palette-title'}>{palette.title}</div>
        <div className={'saved-palettes-palette-content'}>
          {palette.colors.map(color => {
            return (
              <div
                key={color + palette.objectId}
                className={'saved-palettes-palette-content-color'}
                style={{ background: color }}
              />
            )
          })}
          {renderMenuPopover(palette)}
        </div>
      </div>
    )
  }

  const { defaultPalette, favouritePalettes, otherPalettes } = useMemo(() => (
    palettesList.reduce((acc, palette) => {
      const isDefaultPalette = palette.objectId === user.defaultPaletteId
      const isFavouritePalette = (user.favouritePalettesIds || []).includes(palette.objectId)
      if (isDefaultPalette) return {...acc, defaultPalette: palette}
      if (isFavouritePalette) return { ...acc, favouritePalettes: [...acc.favouritePalettes, palette] }
      return { ...acc, otherPalettes: [...acc.otherPalettes, palette] }
    }, { defaultPalette: null, favouritePalettes: [], otherPalettes: [] })
  ), [user, palettesList])
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
      {!!defaultPalette && (
        <div className={'saved-palettes-section'}>
          <div className={'saved-palettes-title'}>Default palette</div>
          {renderPalette(defaultPalette)}
        </div>
      )}
      <div className={'saved-palettes-section'}>
        <Collapse title={'Favourite palettes'}>
          {favouritePalettes.map(renderPalette)}
        </Collapse>
      </div>
      {!!otherPalettes.length && (
        <div className={'saved-palettes-section'}>
          <div className={'saved-palettes-title'}>Other palettes</div>
          {otherPalettes.map(renderPalette)}
        </div>
      )}
    </div>
  )
}

export default SavedPalettesSection