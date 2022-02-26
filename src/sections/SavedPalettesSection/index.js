import React, { useEffect, useState } from 'react'
import { useApi } from "hooks"
import { Button, Navigation, Popover } from "components"
import { sections } from "helpers"
import { TrashIcon, ShareIcon } from "icons"

import './SavedPalettesSection.css'

const SavedPalettesSection = ({ handleChangeSection }) => {
  const [palettesList, setPalettesList] = useState([])
  const { loading, getAllPalettes, deletePalette } = useApi()

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

  const handleDeletePalette = (id, closePopover) => () => {
    deletePalette(id).then((res) => {
      if (res?.result === 'success') {
        const newPalettesList = palettesList.filter(palette => id !== palette.objectId)
        setPalettesList(newPalettesList)
      }
      closePopover()
    })
  }

  const renderPalettesList = () => {
    const navigationItems = sections.map(item => {
      return {
        ...item,
        onClick: () => handleChangeSection(item.id)
      }
    })

    return (
      <div>
        <div className={'saved-palettes-hint'}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, nihil.
        </div>
        <Navigation items={navigationItems} selectedItemId={'saved'} />
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
                <Popover
                  trigger={
                    <div className={'saved-palettes-palette-content-icon saved-palettes-palette-content-delete'}>
                      <TrashIcon />
                    </div>
                  }
                >
                  {close => (
                    <div className={'saved-palettes-palette-content-delete-popover'}>
                      <div>
                        Are you sure you want to delete this palette?
                      </div>
                      <div className={'saved-palettes-palette-content-delete-popover-buttons'}>
                        <Button
                          type={'secondary'}
                          size={'md'}
                          onClick={close}
                        >
                          Cancel
                        </Button>
                        <Button
                          loading={loading}
                          size={'md'}
                          onClick={handleDeletePalette(palette.objectId, close)}
                        >
                          Yes
                        </Button>
                      </div>
                    </div>
                  )}
                </Popover>
                <div
                  className={'saved-palettes-palette-content-icon'}
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('share item')
                  }}
                >
                  <ShareIcon />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return renderPalettesList()
}

export default SavedPalettesSection