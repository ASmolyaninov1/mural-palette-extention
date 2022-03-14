import React, { useEffect, useState } from 'react'
import { PaletteAccessRadio } from "components"
import { Popover, Button } from 'elements'

import './SavePalettePopover.css'

const SavePalettePopover = ({ handleSave, position = 'center', triggerText = 'save', defaultTitle = '' }) => {
  const [title, setTitle] = useState('')
  const [access, setAccess] = useState('me')
  useEffect(() => {
    setTitle(defaultTitle)
  }, [defaultTitle])
  const handleChangeAccess = (access) => {
    setAccess(access)
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
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSave(title)
                  close()
                }
              }}
              defaultValue={defaultTitle}
            />
            <PaletteAccessRadio access={access} onChange={handleChangeAccess} />
            <Button
              size={'md'}
              disabled={!title.length}
              onClick={() => {
                handleSave(title, access)
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