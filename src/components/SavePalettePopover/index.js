import React, { useEffect, useState } from 'react'
import { PaletteAccessRadio } from "components"
import { Popover, Button } from 'elements'

import './SavePalettePopover.css'

const SavePalettePopover = props => {
  const [palette, setPalette] = useState({ access: 'me', title: '' })

  const { handleSave, position = 'center', triggerText = 'save', defaultValues } = props

  useEffect(() => {
    if (!!defaultValues) {
      setPalette(defaultValues)
    }
  }, [defaultValues])

  const handleChangeAccess = (access) => {
    setPalette({ ...palette, access })
  }
  const handleChangeTitle = (e) => {
    const title = e.target.value
    setPalette({ ...palette, title })
  }
  const handleConfirm = () => {
    handleSave(palette.title, palette.access)
  }

  return (
    <Popover position={position} trigger={<span className={'save-palette-popover-trigger'}>{triggerText}</span>}>
      {
        (close => (
          <div className={'save-palette-popover'}>
            <div className={'save-palette-popover-title'}>Name palette to save it</div>
            <input
              className={'save-palette-popover-input'}
              placeholder={'Type title here'}
              onChange={handleChangeTitle}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleConfirm()
                  close()
                }
              }}
              defaultValue={palette.title}
            />
            <PaletteAccessRadio access={palette.access} onChange={handleChangeAccess} />
            <Button
              size={'md'}
              disabled={!palette?.title?.length}
              onClick={() => {
                handleConfirm()
                close()
              }}
            >
              Save palette
            </Button>
          </div>
        ))
      }
    </Popover>
  )
}

export default SavePalettePopover