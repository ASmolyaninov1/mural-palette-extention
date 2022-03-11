import React, { useEffect, useState } from 'react'
import { Button, Popover, Radio } from "components"

import './SavePalettePopover.css'

const SavePalettePopover = ({ handleSave, position = 'center', triggerText = 'save', defaultTitle = '' }) => {
  const [title, setTitle] = useState('')
  const [access, setAccess] = useState('me')
  useEffect(() => {
    setTitle(defaultTitle)
  }, [defaultTitle])
  const handleChangeAccess = (access) => () => {
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
            <div className={'save-palette-popover-title'}>
              Who can use this palette?
            </div>
            <div className={'save-palette-popover-access-action'}>
              <Radio
                label={'Only me'}
                checked={access === 'me'}
                onChange={handleChangeAccess('me')}
              />
            </div>
            <div className={'save-palette-popover-access-action'}>
              <Radio
                label={'Members of workspace'}
                checked={access === 'workspace'}
                onChange={handleChangeAccess('workspace')}
              />
            </div>
            <div className={'save-palette-popover-access-action'}>
              <Radio
                label={'Members of company'}
                checked={access === 'company'}
                onChange={handleChangeAccess('company')}
              />
            </div>
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