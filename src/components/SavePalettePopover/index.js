import React, { useEffect, useState } from 'react'
import { Button, Popover } from "components"

import './SavePalettePopover.css'

const SavePalettePopover = ({ handleSave, position = 'center', triggerText = 'save', defaultTitle = '' }) => {
  const [title, setTitle] = useState('')
  useEffect(() => {
    setTitle(defaultTitle)
  }, [defaultTitle])

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
            <Button
              size={'md'}
              disabled={!title.length}
              onClick={() => {
                handleSave(title)
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